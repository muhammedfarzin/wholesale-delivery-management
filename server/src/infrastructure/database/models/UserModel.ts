import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
  name: string;
  mobile: string;
  password: string;
  role: "admin" | "truck_driver";
} & (
  | { role: "truck_driver"; address: string; drivingLicense: string }
  | {
      role: "admin";
      username: string;
    }
);

const userSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // Ensure 10-digit mobile number
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "truck_driver"],
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    drivingLicense: {
      type: String,
      required: function () {
        return this.role === "truck_driver";
      },
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Export model
export const UserModel = model("User", userSchema, "users");
