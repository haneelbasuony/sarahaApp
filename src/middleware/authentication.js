import revokedTokenModel from '../DB/models/revokedToken.model.js';
import userModel from '../DB/models/user.model.js';
import { verifyToken } from '../utils/token/verifyToken.js';

export const authonication = async (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization) {
    throw new Error('Authorization header is missing');
  }

  // Split the header into prefix and token
  const [prefix, token] = authorization.split(' ') || [];
  if (!prefix || !token) {
    throw new Error('Token is missing or malformed');
  }

  // Select secret signature based on prefix
  let signature = '';
  if (prefix.toLowerCase() === 'bearer') {
    signature = process.env.USER_SECRET_KEY; // For normal users
  } else if (prefix.toLowerCase() === 'admin') {
    signature = process.env.ADMIN_SECRET_KEY; // For admins
  } else {
    throw new Error('Invalid token prefix');
  }

  // Verify token using helper
  const decodedJwt = await verifyToken({
    payload: token,
    SIGNATURE: signature,
  });

  // Find if Revoked Token
  const revokedToken = await revokedTokenModel.findOne({
    tokenId: decodedJwt.jti,
  });
  if (revokedToken) {
    throw new Error('Token is Revoked Please Login Again');
  }

  // Check if user exists
  const user = await userModel.findById(decodedJwt.id);
  if (!user) {
    throw new Error('User does not exist');
  }

  if (!user?.confirmed || user?.isDeleted) {
    throw new Error(
      'Please Confirm Your Email First or Your Account is Freezed'
    );
  }
  // Attach user to request
  req.user = user;
  req.decodedJwt = decodedJwt;
  next();
};
