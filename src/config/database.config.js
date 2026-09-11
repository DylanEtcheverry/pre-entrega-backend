import mongoose from 'mongoose';

export default function connectDatabase(uri) {
  return mongoose.connect(uri);
}