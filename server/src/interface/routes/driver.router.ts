import { Router } from "express";
import * as productController from "../controllers/product.controller";
import * as orderController from "../controllers/order.controller";

const router = Router();

router.get("/products", productController.fetchAllProducts);

router.post("/place-order", orderController.placeOrder);

export { router as driverRouter };
