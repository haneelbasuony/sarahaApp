import mongoose from 'mongoose';

export let userGender = {
  male: 'male',
  female: 'female',
};
export let userRoles = {
  user: 'user',
  admin: 'admin',
};
export let userProvider = {
  system: 'system',
  google: 'google',
};

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [15, 'Name must be at most 10 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: function () {
        return this.provider == userProvider.system ? true : false;
      },
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    profileImage: {
      secure_url: { type: String },
      public_id: { type: String },
    },

    gender: {
      type: String,
      enum: {
        values: Object.values(userGender),
        message: 'Gender must be either male or female',
      },
      default: userGender.male,
    },
    phone: {
      type: String,

      unique: true,
      trim: true,
    },

    age: {
      type: Number,
      min: [18, 'Age must be at least 18'],
      max: [60, 'Age must be at most 60'],
    },

    confirmed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.user,
    },
    otp: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    provider: {
      type: String,
      enum: Object.values(userProvider),
      default: userProvider.system,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
