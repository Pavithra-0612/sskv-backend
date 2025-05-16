import express from 'express';
import { loginUser,registerUser,adminLogin, changePassword, forgotPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/change-password', changePassword);
userRouter.post('/forgot-password',forgotPassword)

export default userRouter;