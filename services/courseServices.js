import CatchAssyncError from "../middleware/catchAssyncError.js";
import CourseModel from "../models/courseModel.js";


export const createCourse = CatchAssyncError(async (data, res) => {

    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course
    })

  
})