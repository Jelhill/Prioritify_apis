import express from 'express';
import { register, login, getAllUsers, getUserById, updateUser, deleteUser, getNumberOfUsers } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', verifyToken, getAllUsers);
router.get('/count', verifyToken, getNumberOfUsers);  // New route for user count
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;
