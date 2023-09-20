
import ErrorHandler from "../utils/errorHandler.js";

export const HandlerError = (req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server";

  // Wrong mongodb error

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Dublicate key error

  if (err.code === 11000) {
    const message = `Dublicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong jwt error

  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expire error

  if (err.name === "TokenExpireError") {
    const message = `Json web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
