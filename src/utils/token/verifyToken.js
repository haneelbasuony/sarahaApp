import jwt from 'jsonwebtoken';
export const verifyToken = async ({ payload, SIGNATURE }) => {
  return jwt.verify(payload, SIGNATURE);
};
