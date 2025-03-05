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
}

export const userRepository = new UserRepository();
