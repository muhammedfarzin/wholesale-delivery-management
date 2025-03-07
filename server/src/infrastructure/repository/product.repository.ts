import { isObjectIdOrHexString, type RootFilterQuery } from "mongoose";
import { ProductModel, ProductType } from "../database/models/ProductModel";
import { userRepository } from "./user.repository";
import { HttpError } from "../errors/HttpError";

class ProductRepository {
  async addProduct(data: ProductType) {
    const product = new ProductModel(data);
    const newProduct = await product.save();
    return newProduct;
  }

  async fetchProducts() {
    const products = await ProductModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
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
    ]);

    return products;
  }

  async findById(productId: string) {
    if (!isObjectIdOrHexString(productId))
      throw new HttpError(400, "Invalid productId");

    const product = await ProductModel.findById(productId);

    if (!product) throw new HttpError(404, "Product not found");

    return product;
  }

  async deleteProducts(productId: string) {
    await ProductModel.findByIdAndDelete(productId);
  }
}

export const productRepository = new ProductRepository();
