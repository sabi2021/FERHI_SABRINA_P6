import mongoose, { Schema, Document } from 'mongoose';

const userSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
