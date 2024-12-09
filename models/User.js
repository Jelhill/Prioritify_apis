import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: { type: String },
}, { timestamps: true }); // Add timestamps option here

const User = mongoose.model('User', userSchema);

export default User;
