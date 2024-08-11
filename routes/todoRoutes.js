import express from 'express';
import { getAllTodos, createTodo, updateTodo, deleteAllTodos, deleteTodo} from '../controllers/todoController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAllTodos);
router.post('/', auth, createTodo);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);
router.delete('/delete/all', auth, deleteAllTodos);

export default router;
