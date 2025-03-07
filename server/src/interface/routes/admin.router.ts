import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import * as productController from "../controllers/product.controller";

const router = Router();

router.post("/user", adminController.createUser);
router.put("/user", adminController.updateUser);
router.get("/users", adminController.fetchUsers);
router.get("/user/:userId", adminController.fetchUserData);
router.delete("/user/:userId", adminController.deleteUser);

router.post("/product", productController.addProduct);
router.put("/product/:productId", productController.updateProduct);
router.delete("/product/:productId", productController.deleteProduct);
router.get("/products", productController.fetchAllProducts);
router.get("/product/:productId", productController.fetchProductDetails);

export { router as adminRouter };
