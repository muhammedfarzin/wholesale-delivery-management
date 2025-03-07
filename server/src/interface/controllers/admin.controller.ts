import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repository/user.repository";
import { UserType } from "../../infrastructure/database/models/UserModel";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, username, mobile, drivingLicense, address, role } =
      req.body as Partial<UserType>;

    if (role !== "admin" && role !== "truck_driver") {
      throw new HttpError(400, "Invalid Role");
    } else if (
      !name ||
      !mobile ||
      (role === "truck_driver" && (!drivingLicense || !address)) ||
      (role === "admin" && !username)
    ) {
      console.log(name, mobile, role, drivingLicense, address, username);
      throw new HttpError(400, "All Fields are required");
    }

    const driver = await userRepository.createUser({
      role,
      name,
      username,
      mobile,
      drivingLicense,
      address,
    });

    res.status(201).json(driver);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, username, mobile, drivingLicense, address, role, userId } =
      req.body as Partial<UserType> & { userId?: string };

    if (role !== "admin" && role !== "truck_driver") {
      throw new HttpError(400, "Invalid Role");
    } else if (!userId) {
      throw new HttpError(400, "Please provide userId");
    } else if (
      !name ||
      !mobile ||
      (role === "truck_driver" && (!drivingLicense || !address)) ||
      (role === "admin" && !username)
    ) {
      throw new HttpError(400, "All Fields are required");
    }

    await userRepository.updateUser(userId, {
      role,
      name,
      username,
      mobile,
      drivingLicense,
      address,
    });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const fetchUsers: RequestHandler = async (req, res, next) => {
  try {
    const { type } = req.query as Partial<Record<string, string>>;

    if (type !== undefined && type !== "admin" && type !== "truck_driver") {
      throw new HttpError(400, "Invalid user type");
    }

    const users = await userRepository.fetchUsers(type);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const fetchUserData: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userData = await userRepository.findById(userId);
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await userRepository.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
