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
