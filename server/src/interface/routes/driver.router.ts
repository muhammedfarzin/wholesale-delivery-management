import { Router } from "express";
import * as productController from "../controllers/product.controller";

const router = Router();

router.get("/products", productController.fetchAllProducts);

export { router as driverRouter };
