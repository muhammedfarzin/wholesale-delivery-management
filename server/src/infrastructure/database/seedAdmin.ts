import { UserModel } from "./models/UserModel";

export const createSuperAdmin = async () => {
  try {
    const existingAdmin = await UserModel.findOne({ role: "admin" });

    if (!existingAdmin) {
      const admin = new UserModel({
        username: "admin",
        name: "Super Admin",
        mobile: "9999999999",
        password: "Admin@123",
        role: "admin",
        address: "Head Office",
      });

      await admin.save();
      console.log("Super Admin created successfully.");
    }
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    process.exit(1);
  }
};
