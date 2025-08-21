import mongoose from 'mongoose';

const checkConnectionDB = async () => {
  await mongoose
    .connect(process.env.DB_URL_ONLINE)
    .then(() => {
      console.log('Suceccs DB Connection ^_^');
    })
    .catch((error) => {
      console.log(`Failed to Connect To DB ¯\_(ツ)_/¯ `, error);
    });
};

export default checkConnectionDB;
