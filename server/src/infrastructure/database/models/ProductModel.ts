import { model, Schema, type Types } from "mongoose";

export interface ProductType {
  name: string;
  price: number;
  category: string;
  vendorId: Types.ObjectId;
}

const productSchema = new Schema<ProductType>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      requried: true,
    },
    category: {
      type: String,
      required: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductModel = model("Product", productSchema, "products");
