import mongoose, { Schema, Document, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema: Schema = new Schema({
  email: { type: String, required: true,  unique: true },
  password: { type: String, required: true }
});

// Définition du modèle de l'utilisateur à partir du schéma
interface UserDoc extends Document {
  username: string;
  password: string;
}

userSchema.plugin(uniqueValidator);

export default mongoose.model<UserDoc>('User', userSchema);
