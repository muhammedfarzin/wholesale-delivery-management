import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { orderRepository } from "../../infrastructure/repository/order.repository";

export const placeOrder: RequestHandler = async (req, res, next) => {
  try {
    const orderedBy = req.user?.userId!;
    const { address } = req.body as Partial<Record<string, string>>;
    const products = req.body.products as
      | {
          id?: string;
          count?: number;
        }[]
      | undefined;

    if (!(products instanceof Array)) {
      throw new HttpError(400, "Products must be in array");
    } else if (!address?.trim()) {
      throw new HttpError(400, "Please enter address");
    }

    const orders = await Promise.all(
      products.map((product) => {
        if (
          typeof product.id !== "string" ||
          typeof product.count !== "number"
        ) {
          throw new HttpError(400, "Invalid productId");
        } else if (product.count < 1) {
          throw new HttpError(400, "Count cannot less than one");
        }

        return orderRepository.placeOrder(
          product.id,
          product.count,
          address,
          orderedBy
        );
      })
    );

    res.status(201).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user!;

    if (typeof status !== "string") {
      console.log(typeof status);
      throw new HttpError(400, "Status must be in string");
    } else if (status !== "delivered" && status !== "cancelled") {
      throw new HttpError(400, "Invalid status");
    }

    await orderRepository.updateStatus(
      orderId,
      status,
      role,
      userId.toString()
    );

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const fetchOrders: RequestHandler = async (req, res, next) => {
  try {
    const { role, userId } = req.user!;

    const orders = await orderRepository.fetchOrders(role, userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
