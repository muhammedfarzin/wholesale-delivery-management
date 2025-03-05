import { type RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repository/user.repository";
import { generateToken } from "../../application/services/token.service";

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

  const user = await userRepository.authenticateUser(username, password, role);

  if (!user) {
    return next(new HttpError(400, "Invalid credentials"));
  }

  const tokens = generateToken({ _id: user._id.toString(), role: user.role });
  res.status(200).json(tokens);
};
