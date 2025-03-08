import { isObjectIdOrHexString, type Types } from "mongoose";
import { HttpError } from "../errors/HttpError";
import { productRepository } from "./product.repository";
import { OrderModel } from "../database/models/OrderModel";

class OrderRepository {
  async placeOrder(
    productId: string,
    count: number,
    address: string,
    orderedBy: Types.ObjectId
  ) {
    if (!isObjectIdOrHexString(productId))
      throw new HttpError(400, "Invalid productId");

    const productData = await productRepository.findById(productId);

    if (!productData) throw new HttpError(404, "Product not found");

    const order = new OrderModel({
      productId,
      orderedBy,
      address,
      count,
      price: productData.price * count,
    });

    const newOrder = await order.save();

    return newOrder.toObject();
  }
}

export const orderRepository = new OrderRepository();
