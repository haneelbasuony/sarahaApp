import userModel, {
  userProvider,
  userRoles,
} from '../../DB/models/user.model.js';
import bcrypt, { compare, compareSync } from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import CryptoJS from 'crypto-js';
import { generateToken } from '../../utils/token/generateToken.js';
import { verifyToken } from '../../utils/token/verifyToken.js';
import { eventEmitter } from '../../utils/emailEvents/index.js';
import { customAlphabet, nanoid } from 'nanoid';
import revokedTokenModel from '../../DB/models/revokedToken.model.js';
import { Hash } from '../../utils/Hash/hash.js';
import { Compare } from '../../utils/Hash/compare.js';
import { sendEmail } from '../../service/sendEmail.js';
import {
  decryptData,
  encryptData,
} from '../../utils/encryption/phoneEncryption.js';
import cloudinary from '../../utils/cloudinary/index.js';

//===============SignUp===================
export const signUp = async (req, res, next) => {
  const { name, email, password, phone, gender, age } = req.body;
  if (!req?.file) {
    throw new Error('Image is required');
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req?.file?.path,
    {
      folder: 'sarahaApp/usersProfilePics',
    }
  );

  // Check if email already exists
  if (await userModel.findOne({ email })) {
    throw new Error('User Already Exist 😞');
  }

  // Hash the password before saving to DB
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  // Encrypt the phone number using AES
  let encryptedPhone = CryptoJS.AES.encrypt(
    phone,
    process.env.PHONE_SECRET_KEY
  ).toString();

  // Send Email
  eventEmitter.emit('sendEmail', { email });

  // Create user in database
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    phone: encryptedPhone,
    gender,
    age,
    profileImage: { secure_url, public_id },
  });

  return res
    .status(201)
    .json({ message: 'User Created Successfully', data: user });
};

//==============Confirm Email ===============
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;

  // Check if token is provided
  if (!token) {
    throw new Error('Token not found');
  }

  // Verify JWT token and decode email
  const decodedJwt = await verifyToken({
    payload: token,
    SIGNATURE: process.env.USER_SECRET_KEY,
  });

  // Find unconfirmed user by decoded email
  const user = await userModel.findOne({
    email: decodedJwt.email,
    confirmed: false,
  });

  // If no such user, throw error
  if (!user) {
    throw new Error('User Doesnt Exist or Already Confirmed');
  }

  // Mark user as confirmed and save
  user.confirmed = true;
  await user.save();

  return res.status(200).json({ message: 'Your Email is Now Confirmed ✔' });
};

//=====================Signin==========================
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Find confirmed user by email
  const user = await userModel.findOne({ email, confirmed: true });
  if (!user) {
    throw new Error(`Email Doesn't exist or Not Confirmed`);
  }

  // Compare input password with hashed password in DB
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    throw new Error(`Password don't match`);
  }

  // Choose secret key based on user role
  const secret =
    user.role === userRoles.user
      ? process.env.USER_SECRET_KEY
      : process.env.ADMIN_SECRET_KEY;

  // Create access token (valid for 30 minutes)
  const access_token = await generateToken({
    payload: { id: user._id, email },
    SIGNATURE: secret,
    options: { expiresIn: 60 * 30, jwtid: nanoid() },
  });

  // Create refresh token (valid for 1 year)
  const refresh_token = await generateToken({
    payload: { id: user._id, email },
    SIGNATURE: secret,
    options: { expiresIn: '1y', jwtid: nanoid() },
  });

  return res
    .status(200)
    .json({ message: 'Login Success', access_token, refresh_token });
};

//=====================Login with gmail==========================
export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new Error('idToken is required');
  }

  const client = new OAuth2Client(process.env.WEB_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });

  const { email, email_verified, picture, name } = ticket.getPayload();

  if (!email_verified) {
    throw new Error('Email is not verified by Google');
  }

  let user = await userModel.findOne({ email });

  if (!user) {
    user = await userModel.create({
      name,
      email,
      confirmed: email_verified,
      provider: userProvider.google,
      image: picture,
      role: userRoles.user, // default role if new
      password: nanoid(), // random password if you require it in schema
    });
  }

  // Access token (30 minutes)
  const access_token = await generateToken({
    payload: { id: user._id, email },
    SIGNATURE: process.env.USER_SECRET_KEY,
    options: { expiresIn: 60 * 30, jwtid: nanoid() },
  });

  // Refresh token (1 year)
  const refresh_token = await generateToken({
    payload: { id: user._id, email },
    SIGNATURE: process.env.USER_SECRET_KEY,
    options: { expiresIn: '1y', jwtid: nanoid() },
  });

  return res.status(200).json({
    message: 'Login Success',
    access_token,
    refresh_token,
  });
};
// ======================= Get Profile ==============================
export const getProfile = async (req, res, next) => {
  const { user } = req;

  // Decrypt the user's phone number
  const decryptedPhone = decryptData(user.phone);

  user.phone = decryptedPhone;

  return res.status(200).json({ message: 'Success => View Profile', user });
};

// ==========================Logout==========================
export const logOut = async (req, res, next) => {
  const { jti, exp } = req.decodedJwt;
  const revokedToken = await revokedTokenModel.create({
    tokenId: jti,
    expiresAt: new Date(exp * 1000),
    reason: 'logout',
  });
  return res.status(200).json({ message: 'sucess' });
};

//======================Update Password======================
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (
    !(await Compare({ plainText: oldPassword, cipherText: req.user.password }))
  ) {
    throw new Error('Invalid Old Password');
  }
  const newHashedPassword = await Hash({ plainText: newPassword });
  req.user.password = newHashedPassword;
  await req.user.save();
  return res.status(200).json({ message: 'sucess' });
};

//=================Forget Password===============
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User Email Doesnt exist');
  }
  const otp = customAlphabet('0123456789', 5)();

  eventEmitter.emit('forgetPassword', { email, otp });

  user.otp = await Hash({ plainText: otp });
  await user.save();

  return res.status(200).json({ message: 'Check Your Email' });
};

//=========== Reset Password=======================
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const user = await userModel.findOne({ email, otp: { $exists: true } });
  if (!user) {
    throw new Error('User Email Doesnt exist or OTP Invalid');
  }

  const hasedNewPassword = await Hash({ plainText: newPassword });
  if (!(await Compare({ plainText: otp, cipherText: user?.otp }))) {
    throw new Error('OTP Doesnt Match ');
  }

  await userModel.updateOne(
    { email },
    { password: hasedNewPassword, $unset: { otp: '' } }
  );
  return res.status(200).json({ message: 'Password Updated Succesfully' });
};

//==================Update Profile======================
export const updateProfile = async (req, res, next) => {
  const { email, name, phone, age, gender } = req.body;
  if (email) {
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      throw new Error('Email Already Exist');
    }
    eventEmitter.emit('sendEmail', { email });
    req.user.confirmed = false;
    req.user.email = email;
  }

  if (name) req.user.name = name;
  if (phone) req.user.phone = encryptData(phone);
  if (age) req.user.age = age;
  if (gender) req.user.gender = gender;

  await req.user.save();

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: req.user,
  });
};

// =====================Visit Profile===================
export const visitProfile = async (req, res, next) => {
  const { id } = req.params;

  const user = await userModel
    .findById(id)
    .select('-password -role -confirmed -phone -createdAt -updatedAt -__v');
  return res.status(200).json({
    data: user,
  });
};

// =====================Freeze Account =================
export const freezeAccount = async (req, res, next) => {
  const { id } = req.params;

  if (id && req.user.role !== userRoles.admin) {
    throw new Error('you can not freeze this account');
  }

  const user = await userModel.updateOne(
    {
      _id: id || req.user._id,
      isDeleted: { $exists: false },
    },
    {
      isDeleted: true,
      deletedBy: req.user._id,
      $inc: { __v: 1 },
    }
  );

  user.matchedCount
    ? res.status(200).json({ message: 'success' })
    : res.status(400).json({ message: 'fail to freeze' });
};
