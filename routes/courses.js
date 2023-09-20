import express from 'express';
import { autherizedRole, isAuthenticated} from '../utils/auth.js';
import { uploadCourse } from '../controllers/courses.js';

const courseRouter = express.Router()

courseRouter.post('/createCourse', isAuthenticated, autherizedRole, uploadCourse)


export default courseRouter