import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as userController from '../../controllers/userController.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from '../../constants/statusCodes.js';
import ResponseHandler from '../../utils/responseHandler.js';

jest.mock('../../models/User.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/responseHandler.js');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    req = {
      body: {}
    };
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      req.body = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue({ _id: 'userId', full_name: 'John Doe', email: 'john.doe@example.com' });
      jwt.sign.mockReturnValue('token');

      await userController.register(req, res);

      expect(ResponseHandler.success).toHaveBeenCalledWith(
        res,
        { user: { _id: 'userId', full_name: 'John Doe', email: 'john.doe@example.com' }, token: 'token' },
        'User registered successfully',
        StatusCodes.CREATED
      );
    });

    it('should handle missing input', async () => {
      req.body = { email: 'john.doe@example.com' }; // Missing password and full_name

      await userController.register(req, res);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        res,
        StatusCodes.BAD_REQUEST,
        'All input is required'
      );
    });

    it('should handle user already exists', async () => {
      req.body = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };
      User.findOne.mockResolvedValue({}); // Simulates that user already exists

      await userController.register(req, res);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        res,
        StatusCodes.CONFLICT,
        'User Already Exist. Please Login'
      );
    });

    it('should handle server error', async () => {
      req.body = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };
      User.findOne.mockRejectedValue(new Error('Server error'));

      await userController.register(req, res);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Server error'
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      req.body = {
        email: 'john.doe@example.com',
        password: 'password123'
      };
      User.findOne.mockResolvedValue({ _id: 'userId', email: 'john.doe@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      await userController.login(req, res);

      expect(ResponseHandler.success).toHaveBeenCalled();
    });


    it('should handle missing input', async () => {
      req.body = { email: 'john.doe@example.com' }; // Missing password

      await userController.login(req, res);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        res,
        StatusCodes.BAD_REQUEST,
        'All input is required'
      );
    });

    it('should handle invalid credentials', async () => {
      req.body = {
        email: 'john.doe@example.com',
        password: 'password123'
      };
      User.findOne.mockResolvedValue({ _id: 'userId', email: 'john.doe@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      await userController.login(req, res);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        res,
        StatusCodes.BAD_REQUEST,
        'Invalid Credentials'
      );
    });

    it('should handle server error', async () => {
      req.body = {
        email: 'john.doe@example.com',
        password: 'password123'
      };
      User.findOne.mockRejectedValue(new Error('Server error'));

      await userController.login(req, res);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Server error'
      );
    });
  });
});