import express from 'express';
import { 
    activateUser, 
    createUser, 
    getUserInfo, 
    loginUser, 
    logoutUser, 
    socialAuth, 
    updatePassword, 
    updateUserInfo, 
    uploadAvatar 
} from '../controllers/user.js';
import { autherizedRole, isAuthenticated, updateAccessToken } from '../utils/auth.js';

const userRouter = express.Router()

userRouter.post('/register', createUser)
userRouter.post('/activateUser', activateUser)
userRouter.post('/login', loginUser)
userRouter.get('/logout', isAuthenticated,  logoutUser)
userRouter.get('/refreshToken', updateAccessToken)
userRouter.get('/me', isAuthenticated, getUserInfo)
userRouter.post('/socialAuth', socialAuth)
userRouter.put('/updateUser', isAuthenticated, updateUserInfo)
userRouter.put('/updatePassword', isAuthenticated, updatePassword)
userRouter.put('/uploadAvatar', isAuthenticated, uploadAvatar)

export default userRouter