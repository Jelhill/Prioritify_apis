import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as todoController from '../../controllers/todoController.js'; // Adjust path as needed
import Todo from '../../models/Todo.js'; 
import { StatusCodes } from '../../constants/statusCodes.js';
import ResponseHandler from '../../utils/responseHandler.js';

jest.mock('../../models/Todo.js');
jest.mock('../../utils/responseHandler.js');

describe('TodoController', () => {
  let req, res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    req = {
      params: {},
      body: {},
      query: {},
      user: { user_id: 'testUserId' } 
    };
  });

  describe('getAllTodos', () => {
    it('should get all todos', async () => {
      const todos = [
        {
          _id: '609e4b3e9f1b2b001f8a3c1e',
          title: 'Test Todo 1',
          description: 'This is a test todo item.',
          priority: 'High',
          startTime: new Date('2024-08-01T09:00:00Z'),
          endTime: new Date('2024-08-01T10:00:00Z'),
          durationMinutes: 60,
          reminder: '10 minutes before',
          status: 'PENDING',
          userId: '609e4b3e9f1b2b001f8a3c1f'
        },
        {
          _id: '609e4b3e9f1b2b001f8a3c2e',
          title: 'Test Todo 2',
          description: 'Another test todo item.',
          priority: 'Medium',
          startTime: new Date('2024-08-02T14:00:00Z'),
          endTime: new Date('2024-08-02T15:00:00Z'),
          durationMinutes: 45,
          reminder: '15 minutes before',
          status: 'COMPLETED',
          userId: '609e4b3e9f1b2b001f8a3c1f'
        }
      ];

      Todo.find.mockResolvedValue(todos);
      ResponseHandler.success.mockImplementation((res, data) => {
        res.status(StatusCodes.OK).json(data);
      });

      await todoController.getAllTodos(req, res);

      expect(ResponseHandler.success).toHaveBeenCalledWith(res, todos);
    });

    it('should handle server error', async () => {
      const errorMessage = 'Server error';
      Todo.find.mockRejectedValue(new Error(errorMessage));
      ResponseHandler.error.mockImplementation((res, statusCode, message) => {
        res.status(statusCode).json({ message });
      });

      await todoController.getAllTodos(req, res);

      expect(ResponseHandler.error).toHaveBeenCalledWith(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
    });
  })  

  describe('getTodoById', () => {
    it('should get a todo by ID', async () => {
      req.params.id = 'testTodoId';
      const todo = { title: 'Test Todo' };
      Todo.findById.mockResolvedValue(todo);

      await todoController.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(todo);
    });

    // it('should handle missing ID', async () => {
    //   await todoController.getTodoById(req, res);

    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    //   expect(res.json).toHaveBeenCalledWith({
    //     success: false,
    //     message: 'Todo ID is required'
    //   });
    // });

    // it('should handle todo not found', async () => {
    //   req.params.id = 'testTodoId';
    //   Todo.findById.mockResolvedValue(null);

    //   await todoController.getTodoById(req, res);

    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    //   expect(res.json).toHaveBeenCalledWith({
    //     success: false,
    //     message: 'Todo not found'
    //   });
    // });

    // it('should handle server error', async () => {
    //   req.params.id = 'testTodoId';
    //   Todo.findById.mockRejectedValue(new Error('Server error'));

    //   await todoController.getTodoById(req, res);

    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    //   expect(res.json).toHaveBeenCalledWith({
    //     success: false,
    //     message: 'Server error',
    //     error: 'Server error'
    //   });
    // });
  });

  describe('getTodosByUserId', () => {
    it('should get all todos by userId', async () => {
      const todos = [{ title: 'Test Todo' }];
      Todo.find.mockResolvedValue(todos);

      await todoController.getTodosByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    // it('should handle missing userId', async () => {
    //   req.user.user_id = null;

    //   await todoController.getTodosByUserId(req, res);

    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    //   expect(res.json).toHaveBeenCalledWith({
    //     success: false,
    //     message: 'User ID is required'
    //   });
    // });

    // it('should handle no todos found', async () => {
    //   Todo.find.mockResolvedValue([]);

    //   await todoController.getTodosByUserId(req, res);

    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    //   expect(res.json).toHaveBeenCalledWith({
    //     success: false,
    //     message: 'No todos found for this user'
    //   });
    // });

    // it('should handle server error', async () => {
    //   Todo.find.mockRejectedValue(new Error('Server error'));

    //   await todoController.getTodosByUserId(req, res);

    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    //   expect(res.json).toHaveBeenCalledWith({
    //     success: false,
    //     message: 'Server error',
    //     error: 'Server error'
    //   });
    // });
  });
});
