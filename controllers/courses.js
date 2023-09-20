import CatchAssyncError from "../middleware/catchAssyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { createCourse } from "../services/courseServices.js";


export const uploadCourse = CatchAssyncError(async (req, res, next) => {
    try {
        const data = req.body;

 
        const thumbnail = data.thumbnail;

        if (thumbnail) {
           

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
              folder: "courses",
              width: 150,
            });
            data.thumbnail = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
        }

        createCourse(data, res, next)
     
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });