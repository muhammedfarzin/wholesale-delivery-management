import { type RequestHandler } from "express";
import { type TokenPayloadType } from "../../application/services/token.service";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repository/user.repository";

export const authenticateToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      throw new HttpError(401, "Unauthorized: No token provided");
    }

    const data = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "secret"
    ) as TokenPayloadType;

    var userData = await userRepository.findById(data._id);
    if (!userData) throw new HttpError(401, "Unauthorized: Invalid token");

    req.user = { ...userData, userId: userData._id };

    next();
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      next(new HttpError(401, "Your token has been expired"));
    } else next(error);
  }
};
