import Todo from '../models/Todo.js';
import { validationResult } from 'express-validator';
import { StatusCodes } from '../constants/statusCodes.js';
import ResponseHandler from '../utils/responseHandler.js';

export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({});
    return ResponseHandler.success(res, todos);
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Todo ID is required');
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'Todo not found');
    }

    return ResponseHandler.success(res, todo, 'Todo retrieved successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getTodosByUserId = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'User ID is required');
    }

    const todos = await Todo.find({ userId });

    if (!todos.length) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'No todos found for this user');
    }

    return ResponseHandler.success(res, todos, 'Todos retrieved successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getCompletedTasksByUser = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'User ID is required');
    }

    const completedTasks = await Todo.find({ userId, status: 'COMPLETED' });

    return ResponseHandler.success(res, completedTasks, 'Completed tasks retrieved successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Validation errors', errors.array());
    }

    const { title, description, priority, startTime, endTime, durationMinutes, reminder, status } = req.body;
    const userId = req.user.user_id;
    
    const todo = new Todo({
      title,
      description,
      priority,
      startTime,
      endTime,
      durationMinutes,
      reminder,
      status,
      userId,
    });

    await todo.save();

    return ResponseHandler.success(res, todo, 'Todo created successfully', StatusCodes.CREATED);
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Validation errors', errors.array());
    }

    const { id } = req.params;
    const { title, description, priority, startTime, endTime, durationMinutes, reminder, status, completedTime } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, description, priority, startTime, endTime, durationMinutes, reminder, status, completedTime },
      { new: true }
    );

    if (!todo) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'Todo not found');
    }

    return ResponseHandler.success(res, todo, 'Todo updated successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'Todo not found');
    }

    return ResponseHandler.success(res, null, 'Todo deleted successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const deleteAllTodos = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'User ID is required');
    }

    await Todo.deleteMany({ userId });
    return ResponseHandler.success(res, null, 'All todos deleted successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Status is required');
    }

    // Validate status value
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Invalid status value');
    }
    const todo = await Todo.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!todo) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'Todo not found');
    }

    return ResponseHandler.success(res, todo, 'Todo status updated successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};


export const getTodosByStatus = async (req, res) => {
  try {
    const userId = req.user.user_id; 
    const { status } = req.query;

    if (!status) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Status is required');
    }

    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return ResponseHandler.error(res, StatusCodes.BAD_REQUEST, 'Invalid status value');
    }

    const todos = await Todo.find({ userId, status });

    if (!todos.length) {
      return ResponseHandler.error(res, StatusCodes.NOT_FOUND, 'No todos found for this status');
    }

    return ResponseHandler.success(res, todos, 'Todos retrieved successfully');
  } catch (error) {
    return ResponseHandler.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server error');
  }
};
