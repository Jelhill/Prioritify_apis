import express from 'express';
import {
  adminSignup,
  adminLogin,
  getNumberOfUsers,
  getAllUsers,
  getAllTodos,
  getAllTodosByUser,
  getRecentUsers,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getUserById
} from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.get('/users/count', verifyToken, verifyAdmin, getNumberOfUsers);
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/todos', verifyToken, verifyAdmin, getAllTodos);
router.get('/todos/user/:id', verifyToken, verifyAdmin, getAllTodosByUser);
router.get('/users/recent', verifyToken, verifyAdmin, getRecentUsers);
router.get('/users/getbyid/:id', verifyToken, verifyAdmin, getUserById); // New route for getting a user by ID
router.get('/all', verifyToken, verifyAdmin, getAllAdmins); // Fetch all admins
router.put('/update/:id', verifyToken, verifyAdmin, updateAdmin); // Update admin
router.delete('/:id', verifyToken, verifyAdmin, deleteAdmin); // Delete admin

export default router;
