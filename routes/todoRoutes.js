import express from 'express';
import { getAllTodos, createTodo, updateTodo, deleteTodo, deleteAllTodos, getTodoById, getTodosByUserId, getCompletedTasksByUser } from '../controllers/todoController.js';
import auth from '../middleware/auth.js';
import { createTodoValidator, updateTodoValidator, validate } from '../utils/validation.js'

const router = express.Router();

router.get('/', getAllTodos);
router.post('/', auth, createTodoValidator, validate, createTodo);
router.get('/:id', auth, getTodoById); 
router.get('/user/all', auth, getTodosByUserId); 
router.get('/user/completed', auth, getCompletedTasksByUser); // New route for getting completed tasks

router.put('/:id', auth, updateTodoValidator, validate, updateTodo);
router.delete('/:id', auth, deleteTodo);
router.delete('/delete/all', auth, deleteAllTodos);

export default router;
