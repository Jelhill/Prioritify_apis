import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StatusCodes } from '../constants/statusCodes.js';
import ResponseHandler from '../utils/responseHandler.js';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!(email && password && full_name)) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'All input is required');
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return ResponseHandler.error(res, StatusCodes.CONFLICT, 'User Already Exist. Please Login');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: '2h' }
    );

    user.token = token;
    await user.save();

    return ResponseHandler.success(res, { user, token }, 'User registered successfully', StatusCodes.CREATED);
  } catch (err) {
    console.error(err);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'All input is required');
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      );

      user.token = token;
      await user.save();

      return ResponseHandler.success(res, user, 'Login successful', StatusCodes.OK);
    }

    return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Invalid Credentials');
  } catch (err) {
    console.error(err);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -token'); 
    return ResponseHandler.success(res, users, 'All users retrieved successfully');
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'User ID is required');
    }

    const user = await User.findById(id, '-password -token');

    if (!user) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'User not found');
    }

    return ResponseHandler.success(res, user, 'User retrieved successfully');
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password } = req.body;

    if (!id) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'User ID is required');
    }

    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email.toLowerCase();
    if (password) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      updateData.password = encryptedPassword;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password -token' });

    if (!user) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'User not found');
    }

    return ResponseHandler.success(res, user, 'User updated successfully');
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'User ID is required');
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'User not found');
    }

    return ResponseHandler.success(res, null, 'User deleted successfully');
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

// New Method for User Count
export const getNumberOfUsers = async (req, res) => {
  try {
    const count = await User.countDocuments({});
    return ResponseHandler.success(res, { count }, 'Number of users retrieved successfully');
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};
