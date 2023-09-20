
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
// import { redis } from "./redisConnect.js";


dotenv.config();

export const sendToken =  (user, statusCode, res) => {

    const accessToken = user.SignAccessToken()

    const refreshToken = user.SignRefreshToken()



  // redis.set(user._id, JSON.stringify(user));

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

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

 

  res.status(statusCode).json({
    success: true,
    user
  
  });
};
