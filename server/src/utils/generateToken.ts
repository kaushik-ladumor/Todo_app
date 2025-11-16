import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d"
  } as jwt.SignOptions;

  return jwt.sign({ userId }, secret as jwt.Secret, options);
};
