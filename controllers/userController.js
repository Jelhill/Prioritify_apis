import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StatusCodes } from '../constants/statusCodes.js';
import ResponseHandler from '../utils/responseHandler.js'; // Import without 'new'

dotenv.config();

// Register User
export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!(email && password && full_name)) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'All input is required');
    }

    const oldUser = await User.findOne({ email });
    console.log(oldUser)
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

    return ResponseHandler.success(res, { user, token }, 'User registered successfully', StatusCodes.CREATED);
  } catch (err) {
    console.error(err);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

// Login User
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

      return ResponseHandler.success(res, user, 'Login successful', StatusCodes.OK);
    }

    return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Invalid Credentials');
  } catch (err) {
    console.error(err);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};
