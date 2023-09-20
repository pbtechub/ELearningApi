import path from "path";
import CatchAssyncError from "../middleware/catchAssyncError.js";
import userModel from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { generateToken } from "../utils/generateToken.js";
import ejs from "ejs";
import sendmail from "../utils/sendMail.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendToken } from "../utils/jwt.js";
import { getUserId } from "../services/userServices.js";
import cloudinary from "cloudinary";

dotenv.config();

// Register user

export const createUser = CatchAssyncError(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = {
      name,
      email,
      password,
    };

    const activationToken = generateToken(user);
    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };
    const __dirname = path.resolve();
    const html = await ejs.renderFile(
      path.join(__dirname, "mails", "activation-mail.ejs"),
      data
    );

    try {
      await sendmail({
        email: user.email,
        subject: "Activation your account",
        template: "activation-mail.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Activate user registartion

export const activateUser = CatchAssyncError(async (req, res, next) => {
  try {
    const { activation_token, activation_code } = req.body;
    const newUser = jwt.verify(activation_token, process.env.JWT_SECRET_KEY);

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const user = await userModel.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Login user

export const loginUser = CatchAssyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 401));
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);

    // const token = user.SignAccessToken();

    // res.status(201).json({
    //   success: true,
    //   token,
    // });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Logout user

export const logoutUser = CatchAssyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    res.status(201).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get user Info

export const getUserInfo = CatchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user?.id;

    getUserId(userId, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const socialAuth = CatchAssyncError(async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      const newUser = await userModel.create({ email, name, avatar });
      sendToken(newUser, 200, res);
    } else {
      sendToken(user, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateUserInfo = CatchAssyncError(async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    const userId = req.user?.id;

    const user = await userModel.findById(userId);

    if (email && user) {
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("This email is already exist!", 400));
      } else {
        user.email = email;
      }
    }
    if (name && user) {
      user.name = name;
    }
    if (avatar && user) {
      user.avatar = avatar;
    }

    await user?.save();

    res.status(202).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updatePassword = CatchAssyncError(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.user?.id;

    const user = await userModel.findById(userId).select("+password");

    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Please enter a old and new Password", 400));
    }

    if (user?.password === undefined) {
      return next(new ErrorHandler("Invalid user", 400));
    }

    const isPasswordMatched = await user?.comparePassword(oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid old password", 400));
    }

    user.password = newPassword;

    await user?.save();

    res.status(202).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const uploadAvatar = CatchAssyncError(async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const userId = req.user?.id;

    const user = await userModel.findById(userId);

    if (avatar && user) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }

    await user?.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
