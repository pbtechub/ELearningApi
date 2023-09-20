import ErrorHandler from "../utils/errorHandler.js";
import CatchAssyncError from "../middleware/catchAssyncError.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
// import { redis } from "./redis.js";


dotenv.config();

export const isAuthenticated = CatchAssyncError(async (req, res, next) => {
    const access_token = req.cookies.access_token;


    if (!access_token) {
        return next(new ErrorHandler('Please login to access this resource', 400));
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);

    if (!decoded) {
        return next(new ErrorHandler('Access token is not valid', 400));
    }

    const user = await userModel.findById(decoded.id).select('-password')


    if (!user) {
        return next(new ErrorHandler('User not found', 400));
    } 
        
   req.user = user
   

    next()
})

export const updateAccessToken = CatchAssyncError(async (req, res, next) => {

    try {
        const refresh_token = req.cookies.refresh_token;


        if (!refresh_token) {
            return next(new ErrorHandler('Please login to access this resource', 400));
        }
    
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
    
        if (!decoded) {
            return next(new ErrorHandler('Refresh token is not valid', 400));
        }
    
        const session = await userModel.findById(decoded.id).select('-password')

        if (!session) {
            return next(new ErrorHandler(error.message, 400));
        }


        const user = session
        // req.user = session
    
        

        const accessToken = jwt.sign({id:user._id}, process.env.ACCESS_TOKEN, {
            expiresIn: '30d'
        })
        const refreshToken = jwt.sign({id:user._id}, process.env.REFRESH_TOKEN, {
            expiresIn: '3m'
        })

        
        const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300");
        const refreshTokenExpire = parseInt(
          process.env.REFRESH_TOKEN_EXPIRE || "1200"
        );
      
        // options for cookies
        const accessTokenOptions = {
          expires: new Date(Date.now() * accessTokenExpire * 60 * 60 * 1000),
          maxAge: accessTokenExpire * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "lax",
        };
        const refreshTokenOptions = {
          expires: new Date(Date.now() * refreshTokenExpire * 24 * 60 * 60 * 1000),
          maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "lax",
        };
    
    res.cookie('access_token', accessToken, accessTokenOptions)
    res.cookie('refresh_token', refreshToken, refreshTokenOptions)
   
        res.status(201).json({
            status: 'success',
            accessToken,
            refreshToken
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
   
})



export const autherizedRole = CatchAssyncError(() => {

    
   
return (req, res, next) => {
    // if(!roles.includes(req.user?.role || '')) {
    //     return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resorce`, 403));
    // }

    if(req.user?.roles !== 'admin') {
        return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resorce`, 403));
    }

    next()
}
   
})