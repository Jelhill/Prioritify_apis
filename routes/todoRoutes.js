import express from 'express';
import { getAllTodos, createTodo, updateTodo, deleteTodo, deleteAllTodos, getTodoById, getTodosByUserId, getCompletedTasksByUser, updateTodoStatus, getTodosByStatus } from '../controllers/todoController.js';
import { verifyToken} from '../middleware/auth.js';
import { createTodoValidator, updateTodoValidator, validate } from '../utils/validation.js'

const router = express.Router();

router.get('/', getAllTodos);
router.post('/', verifyToken, createTodoValidator, validate, createTodo);
router.get('/:id', verifyToken, getTodoById); 
router.get('/user/all', verifyToken, getTodosByUserId); 
router.get('/user/completed', verifyToken, getCompletedTasksByUser); // New route for getting completed tasks
router.patch('/:id/status', verifyToken, updateTodoStatus); // Add this line
router.get('/user/all/status', verifyToken, getTodosByStatus); // Add this line

router.put('/:id', verifyToken, updateTodoValidator, validate, updateTodo);
router.delete('/:id', verifyToken, deleteTodo);
router.delete('/delete/all', verifyToken, deleteAllTodos);

export default router;
