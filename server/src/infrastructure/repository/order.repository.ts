import { isObjectIdOrHexString, type Types } from "mongoose";
import { HttpError } from "../errors/HttpError";
import { productRepository } from "./product.repository";
import { OrderModel } from "../database/models/OrderModel";
import type { UserType } from "../database/models/UserModel";

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

  async updateStatus(
    orderId: string,
    status: "delivered" | "cancelled",
    role: UserType["role"],
    userId: string
  ) {
    if (!isObjectIdOrHexString(orderId))
      throw new HttpError(400, "Invalid orderId");

    const order = await OrderModel.findById(orderId);

    if (!order || (role !== "admin" && order.orderedBy.toString() !== userId)) {
      throw new HttpError(404, "Order not found");
    } else if (order.status !== "pending") {
      throw new HttpError(
        400,
        "You cannot change status of cancelled or delivered orders"
      );
    }

    await order.updateOne({ $set: { status } });
  }

  async fetchOrders(role: UserType["role"], userId: Types.ObjectId) {
    const orders = await OrderModel.aggregate([
      { $match: role === "truck_driver" ? { orderedBy: userId } : {} },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "orderedBy",
          foreignField: "_id",
          as: "orderedBy",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: "$orderedBy" },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
          pipeline: [
            { $project: { name: 1, image: 1, vendorId: 1 } },
            {
              $lookup: {
                from: "users",
                localField: "vendorId",
                foreignField: "_id",
                as: "vendor",
                pipeline: [{ $project: { name: 1 } }],
              },
            },
            { $unwind: "$vendor" },
          ],
        },
      },
      { $unwind: "$product" },
    ]);

    return orders;
  }
}

export const orderRepository = new OrderRepository();
