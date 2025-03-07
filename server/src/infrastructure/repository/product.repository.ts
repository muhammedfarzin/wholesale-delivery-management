import { isObjectIdOrHexString } from "mongoose";
import { ProductModel, ProductType } from "../database/models/ProductModel";
import { HttpError } from "../errors/HttpError";
import {
  removeFromCloudinary,
  uploadToCloudinary,
} from "../../application/services/cloudinary.service";

class ProductRepository {
  async addProduct(data: ProductType) {
    const imageUrl = await uploadToCloudinary(data.image, "products");

    const product = new ProductModel({ ...data, image: imageUrl });
    const newProduct = await product.save();
    return newProduct;
  }

  async updateProduct(productId: string, data: Partial<ProductType>) {
    if (!isObjectIdOrHexString(productId))
      throw new HttpError(400, "Invalid productId");

    const product = await ProductModel.findById(productId);
    console.log(product, productId);
    if (!product) throw new HttpError(404, "Product not found");

    if (data.image) {
      var imageUrl: string | undefined = await uploadToCloudinary(
        data.image,
        "products"
      );
      var existImageUrl: string | undefined = product.image;
    }

    await product.updateOne({ ...data, image: imageUrl });

    if (data.image && existImageUrl) {
      await removeFromCloudinary(existImageUrl);
    }
  }

  async deleteProduct(productId: string) {
    if (!isObjectIdOrHexString(productId))
      throw new HttpError(400, "Invalid productId");

    await ProductModel.findByIdAndDelete(productId);
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
