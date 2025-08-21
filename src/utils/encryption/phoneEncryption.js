import CryptoJS from 'crypto-js';

const PHONE_SECRET = process.env.PHONE_SECRET_KEY || 'default_secret_key';

// Encrypt data
export const encryptData = async (plainText) => {
  if (!plainText) return null;
  return CryptoJS.AES.encrypt(plainText, PHONE_SECRET).toString();
};

// Decrypt data
export const decryptData = (cipherText) => {
  if (!cipherText) return null;
  return CryptoJS.AES.decrypt(cipherText, PHONE_SECRET).toString(
    CryptoJS.enc.Utf8
  );
};
