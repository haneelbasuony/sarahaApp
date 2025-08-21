import { EventEmitter } from 'events';
import { generateToken } from '../token/generateToken.js';
import { sendEmail } from '../../service/sendEmail.js';

export const eventEmitter = new EventEmitter();

eventEmitter.on('sendEmail', async (data) => {
  const { email } = data;

  // Generate token for email confirmation (expires in 3 minutes)
  const token = await generateToken({
    payload: { email },
    SIGNATURE: process.env.USER_SECRET_KEY,
    options: { expiresIn: 60 * 3 },
  });

  const link = `http://localhost:${process.env.PORT}/user/confirmemail/${token}`;

  // Send confirmation email with token link
  const isSend = await sendEmail({ to: email, link });
  if (!isSend) {
    throw new Error('Fail to send email');
  }
});

eventEmitter.on('forgetPassword', async (data) => {
  const { email, otp } = data;

  // Send confirmation email with token link
  const isSend = await sendEmail({
    to: email,
    subject: 'Foget Password',
    html: `Your OTP is : ${otp}`,
  });
  if (!isSend) {
    throw new Error('Fail to send email');
  }
});
