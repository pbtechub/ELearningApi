import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (user) => {
  try {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
      {
        user,
        activationCode,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    return { token, activationCode };
  } catch (error) {
    return new Error(error.message, 400);
  }
};
