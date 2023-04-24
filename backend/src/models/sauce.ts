import mongoose, { Schema, Document } from 'mongoose';


const sauceSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: false },
  description: { type: String, required: false },
  mainPepper: { type: String, required: false },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: false },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});

interface SauceDoc extends Document {
  userId: String;
  name: String;
  manufacturer: String;
  description: String;
  mainPepper: String;
  imageUrl: String;
  heat: Number;
  likes: Number;
  dislikes: Number;
  usersLiked: [String];
  usersDisliked: [String];
};


export default mongoose.model<SauceDoc>('sauce', sauceSchema);
