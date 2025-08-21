import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Message content is required'],
      minlength: [1, 'Message must be at least 1 character long'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must be linked to a user'],
    },
  },
  {
    timestamps: true,
  }
);

const messageModel =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

export default messageModel;
