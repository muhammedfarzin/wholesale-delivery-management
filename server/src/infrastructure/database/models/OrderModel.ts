import { model, Schema, type Types } from "mongoose";

interface OrderType {
  orderedBy: Types.ObjectId;
  productId: Types.ObjectId;
  address: string;
  count: number;
  price: number;
}

const orderSchema = new Schema<OrderType>({
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
});

export const OrderModel = model("Order", orderSchema, "orders");
