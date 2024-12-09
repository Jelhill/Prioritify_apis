import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  adminType: {
    type: String,
    required: true,
    enum: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
    default: 'ADMIN',
  },
  token: {
    type: String,
  },
}, { timestamps: true }); // This adds createdAt and updatedAt fields

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
