import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const requiredEnv = ['PORT', 'NODE_ENV'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (!mongoUri) missingEnv.push('MONGO_URI');

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(', ')}. ` +
      'Please add them to your .env file.'
  );
}

export default {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: mongoUri,
};
