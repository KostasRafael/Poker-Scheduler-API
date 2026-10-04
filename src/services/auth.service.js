import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import RevokedToken from "../models/revoked-token.model.js";

const SALT_ROUNDS = 10;

const signToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      jwtid: crypto.randomUUID(),
    }
  );
};

export const signupUser = async ({ email, password }) => {
  const existingUser = await User.exists({ email });

  if (existingUser) {
    const error = new Error("Email is already in use");
    error.statusCode = 409;
    error.code = "EMAIL_ALREADY_IN_USE";
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return { user, token: signToken(user) };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  const passwordMatches =
    user && (await bcrypt.compare(password, user.password));

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return { user, token: signToken(user) };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return user;
};

export const logoutUser = async ({ tokenId, tokenExpiresAt }) => {
  await RevokedToken.updateOne(
    { jti: tokenId },
    { jti: tokenId, expiresAt: tokenExpiresAt },
    { upsert: true }
  );
};

export const isTokenRevoked = async (tokenId) => {
  return Boolean(await RevokedToken.exists({ jti: tokenId }));
};
