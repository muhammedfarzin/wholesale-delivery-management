import { UserModel, UserType } from "../database/models/UserModel";
import bcrypt from "bcryptjs";

class UserRepository {
  authenticateUser = async (
    uniqueId: string,
    password: string,
    role: UserType["role"]
  ) => {
    const query =
      role === "admin" ? { username: uniqueId } : { mobile: uniqueId };
    const user = await UserModel.findOne(query);

    if (!user) {
      return null;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const { password: _, ...resUser } = user.toObject();
      return resUser;
    }
    return null;
  };

  createUser = async (
    data: Omit<UserType, "password"> & Partial<Pick<UserType, "password">>
  ) => {
    if (!data.password) {
      data.password = data.mobile;
    }

    const existUser = await UserModel.findOne({
      $or: [{ mobile: data.mobile }, { username: data.username || "" }],
    });

    if (existUser) {
      throw new Error(
        `User already exists with this ${
          data.role === "admin" ? "mobile number or username" : "mobile number"
        }.`
      );
    }

    const user = new UserModel(data);
    await user.save();
    const { password: _, ...resUser } = user.toObject();
    return resUser;
  };

  updateUser = async (userId: string, data: Partial<UserType>) => {
    const user = await UserModel.findByIdAndUpdate(userId, data, { new: true });
  };

  findById = async (userId: string) => {
    const user = await UserModel.findById(userId, { password: 0 });
    return user?.toObject();
  };

  fetchUsers = async (role?: UserType["role"]) => {
    const users = await UserModel.find(
      { role },
      {
        password: 0,
      }
    )
      .sort("-createdAt")
      .limit(20);

    return users.map((user) => user.toObject());
  };

  deleteUser = async (userId: string) => {
    await UserModel.findByIdAndDelete(userId);
  };
}

export const userRepository = new UserRepository();
