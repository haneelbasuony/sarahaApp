import bcrypt from 'bcrypt';

export const Compare = async ({ plainText, cipherText } = {}) => {
  return bcrypt.compare(plainText, cipherText);
};
