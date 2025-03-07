import { RequestHandler } from "express";
import type { ProductType } from "../../infrastructure/database/models/ProductModel";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repository/user.repository";
import { productRepository } from "../../infrastructure/repository/product.repository";

export const addProduct: RequestHandler = async (req, res, next) => {
  const image =
    req.files?.image instanceof Array ? req.files.image[0] : req.files?.image;
  const { name, price, category, vendor } = req.body as Partial<
    ProductType & {
      vendor: string;
    }
  >;

  try {
    if (!name?.trim() || !price || !category?.trim() || !vendor?.trim()) {
      throw new HttpError(400, "All fields are required");
    } else if (isNaN(price) || price < 1) {
      throw new HttpError(400, "Please enter a valid price");
    } else if (!image) {
      throw new HttpError(400, "Please upload product image");
    }

    const vendorData = await userRepository.findById(vendor);

    if (!vendorData || vendorData.role !== "vendor") {
      throw new HttpError(400, "Please select a valid vendor");
    }

    const newProduct = await productRepository.addProduct({
      name,
      price,
      category,
      vendorId: vendorData._id,
      image: image.tempFilePath,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct: RequestHandler = async (req, res, next) => {
  const productId = req.params.productId;
  const image =
    req.files?.image instanceof Array ? req.files.image[0] : req.files?.image;
  const { name, price, category, vendor } = req.body as Partial<
    ProductType & {
      vendor: string;
    }
  >;

  try {
    if (!name?.trim() || !price || !category?.trim() || !vendor?.trim()) {
      throw new HttpError(400, "All fields are required");
    } else if (isNaN(price) || price < 1) {
      throw new HttpError(400, "Please enter a valid price");
    }

    const vendorData = await userRepository.findById(vendor);

    if (!vendorData || vendorData.role !== "vendor") {
      throw new HttpError(400, "Please select a valid vendor");
    }

    await productRepository.updateProduct(productId, {
      name,
      price,
      category,
      vendorId: vendorData._id,
      image: image?.tempFilePath,
    });

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await productRepository.deleteProduct(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const fetchAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await productRepository.fetchProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const fetchProductDetails: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productData = await productRepository.findById(productId);
    res.status(200).json(productData);
  } catch (error) {
    next(error);
  }
};
