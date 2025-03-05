import jwt from "jsonwebtoken";
import { UserType } from "../../infrastructure/database/models/UserModel";

export type TokenPayloadType = Pick<UserType, "role"> & { _id: string };
export interface TokensType {
  accessToken: string;
  refreshToken?: string;
}

export const generateToken = (payload: TokenPayloadType): TokensType => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || "secret",
    {
      expiresIn: "10m",
    }
  );

  var refreshToken: string | undefined = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    {
      expiresIn: "30d",
    }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret =
    type === "access"
      ? process.env.JWT_ACCESS_SECRET
      : process.env.JWT_REFRESH_SECRET;

  const data = jwt.verify(token, secret || "secret") as TokenPayloadType;

  return data;
};
