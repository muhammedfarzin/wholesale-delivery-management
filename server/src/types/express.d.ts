import type { Request } from "express";
import type { UserType } from "../infrastructure/database/models/UserModel";
import type { TokenPayloadType } from "../application/services/token.service";
import { Types } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    user?: Omit<UserType, "password"> & { userId: Types.ObjectId };
  }
}
