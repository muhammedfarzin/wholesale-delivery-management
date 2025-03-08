import { model, Schema, type Types } from "mongoose";

interface OrderType {
  orderedBy: Types.ObjectId;
  productId: Types.ObjectId;
  address: string;
  count: number;
  price: number;
  status: "pending" | "delivered" | "cancelled";
}

const orderSchema = new Schema<OrderType>(
  {
    orderedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "delivered", "cancelled"],
    },
  },
  { timestamps: true }
);

export const OrderModel = model("Order", orderSchema, "orders");
