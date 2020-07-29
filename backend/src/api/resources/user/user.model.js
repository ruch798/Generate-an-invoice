import mongoose from 'mongoose';

const { Schema } = mongoose;
const UserSchema = new Schema({
  local: {
    name: String,
    email: String,
    password: String,
  },
  twitter: {
    username: String,
    id: String,
    token: String,
    displayName: String,
    email: String,
  }
  
});
export default mongoose.model('User', UserSchema);
