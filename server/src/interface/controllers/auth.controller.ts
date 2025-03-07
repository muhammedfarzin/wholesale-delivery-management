import { type RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repository/user.repository";
import {
  generateToken,
  TokensType,
  verifyToken,
} from "../../application/services/token.service";

export const login: RequestHandler = async (req, res, next) => {
  const { username, password, role } = req.body as Record<
    string,
    string | undefined
  >;

  if (!username || !password) {
    return next(new HttpError(400, "Username and password are required"));
  } else if (role !== "admin" && role !== "truck_driver") {
    return next(new HttpError(400, "Invalid role"));
  }

  try {
    const user = await userRepository.authenticateUser(
      username,
      password,
      role
    );

    if (!user) {
      return next(new HttpError(400, "Invalid credentials"));
    }

    const tokens = generateToken({ _id: user._id.toString(), role: user.role });
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  const { token } = req.body as { token?: string };

  try {
    if (!token) {
      throw new HttpError(400, "Refresh token is required.");
    }

    const decoded = verifyToken(token, "refresh");

    if (!decoded) {
      throw new HttpError(403, "Invalid refresh token.");
    }

    const user = await userRepository.findById(decoded._id);
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    const { role, _id } = user;

    const newTokens = generateToken({ role, _id: _id.toString() });

    res.status(200).json({
      tokens: newTokens,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};
