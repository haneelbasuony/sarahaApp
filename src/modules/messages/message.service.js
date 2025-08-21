import userModel from '../../DB/models/user.model.js';
import messageModel from '../../DB/models/message.model.js';
import { PassThroughClient } from 'google-auth-library';

// ================ Send anonymous message================
export const sendMessage = async (req, res, next) => {
  const { userId, content } = req.body;
  const userExist = await userModel.findOne({
    _id: userId,
    $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
  });

  if (!userExist) {
    throw new Error('User not exist or user Account Froze');
  }
  const message = await messageModel.create({ userId, content });
  return res.status(201).json({ message: 'Your message was Sent', message });
};

// ================ View All Message Of a user ================
export const viewAllMessage = async (req, res, next) => {
  const messages = await messageModel
    .find({ userId: req?.user?._id })
    .populate([
      {
        path: 'userId',
      },
    ]);
  return res.status(201).json({ message: 'You Inbox', messages });
};

// ================== Read A Message ====================
export const readMessage = async (req, res, next) => {
  const { id } = req.params;
  const message = await messageModel.findOne({
    userId: req?.user?._id,
    _id: id,
  });

  if (!message) {
    throw new Error('Messgae Not Found');
  }
  return res.status(201).json({ message: 'You Inbox', message });
};
