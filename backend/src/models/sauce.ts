import mongoose, { Schema, Document } from 'mongoose';


const sauceSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usesLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});

export default mongoose.model('sauce', sauceSchema);
