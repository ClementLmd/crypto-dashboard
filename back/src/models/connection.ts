import mongoose from 'mongoose';

let databaseEnvironment: 'test' | 'production';
const defineConnectionString = () => {
  if (process.env.NODE_ENV === 'test') {
    databaseEnvironment = 'test';
    return process.env.CONNECTION_STRING_TEST;
  }
  databaseEnvironment = 'production';
  return process.env.CONNECTION_STRING;
};

const connectionString = defineConnectionString();

if (!connectionString) {
  throw new Error('MongoDB connection string is undefined. Check your environment variables.');
}

export const connectToDatabase = () => {
  mongoose
    .connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log(`Database connected - ${databaseEnvironment}`))
    .catch((error) => console.error(error));
};

connectToDatabase();
