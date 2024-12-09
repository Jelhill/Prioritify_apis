import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StatusCodes } from '../constants/statusCodes.js';
import ResponseHandler from '../utils/responseHandler.js';
import User from '../models/User.js';
import Todo from '../models/Todo.js';
import Admin from '../models/admin.js';

dotenv.config();

export const adminSignup = async (req, res) => {
  try {
    const { firstname, lastname, email, username, password, adminType } = req.body;

    // Validate input
    if (!(firstname && lastname && email && username && password && adminType)) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'All input fields are required');
    }

    // Check if admin already exists
    const existingEmail = await Admin.findOne({ email });
    const existingUsername = await Admin.findOne({ username });

    if (existingEmail) {
      return ResponseHandler.error(res, StatusCodes.CONFLICT, 'Admin with this email already exists');
    }

    if (existingUsername) {
      return ResponseHandler.error(res, StatusCodes.CONFLICT, 'Admin with this username already exists');
    }

    // Hash password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      firstname,
      lastname,
      email,
      username,
      password: encryptedPassword,
      adminType,
    });

    // Create token
    const token = jwt.sign(
      { admin_id: admin._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );

    admin.token = token;
    await admin.save();

    return ResponseHandler.success(res, { admin, token }, 'Admin registered successfully', StatusCodes.CREATED);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!(email && password)) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Email and password are required');
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'Admin not found');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return ResponseHandler.error(res, StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
    }

    // Create new token
    const token = jwt.sign(
      { admin_id: admin._id, email, adminType: admin.adminType },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );

    admin.token = token;
    await admin.save();

    return ResponseHandler.success(res, { admin, token }, 'Admin login successful', StatusCodes.OK);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getNumberOfUsers = async (req, res) => {
  try {
    const count = await User.countDocuments({});
    return ResponseHandler.success(res, { count }, 'Number of users retrieved successfully');
  } catch (error) {
    console.error(error);
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

export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({});
    return ResponseHandler.success(res, todos, 'All todos retrieved successfully');
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getAllTodosByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'User ID is required');
    }
    const todos = await Todo.find({ userId: id });
    return ResponseHandler.success(res, todos, 'All todos by user retrieved successfully');
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    if (!recentUsers.length) {
      return ResponseHandler.success(res, [], 'No recent users found', StatusCodes.OK);
    }

    return ResponseHandler.success(res, recentUsers, 'Recent users retrieved successfully', StatusCodes.OK);
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getAllAdmins = async (req, res) => {
    try {
      const admins = await Admin.find({}, '-password -token'); // Exclude sensitive fields
      return ResponseHandler.success(res, admins, 'All admins retrieved successfully');
    } catch (error) {
      console.error('Error fetching all admins:', error);
      return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
    }
  };
  
  // Update admin
  export const updateAdmin = async (req, res) => {
      console.log("RUNNING UPDATE ADMIN")
    try {
      const { id } = req.params;
      const { firstname, lastname, email, adminType } = req.body;
        
      if (!(firstname && lastname && email && adminType)) {
        return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'All fields are required');
      }
  
      const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        { firstname, lastname, email, adminType },
        { new: true, runValidators: true }
      );
  
      if (!updatedAdmin) {
        return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'Admin not found');
      }
  
      return ResponseHandler.success(res, updatedAdmin, 'Admin updated successfully');
    } catch (error) {
      console.error(error);
      return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
    }
  };
  
  // Delete admin
  export const deleteAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedAdmin = await Admin.findByIdAndDelete(id);
  
      if (!deletedAdmin) {
        return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'Admin not found');
      }
  
      return ResponseHandler.success(res, {}, 'Admin deleted successfully');
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
  
      const user = await User.findById(id, '-password -token'); // Exclude sensitive fields
  
      if (!user) {
        return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'User not found');
      }
  
      return ResponseHandler.success(res, user, 'User retrieved successfully');
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
    }
  };
  