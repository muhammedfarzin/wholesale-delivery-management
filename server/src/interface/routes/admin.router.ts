import { Router } from "express";
import * as adminController from "../controllers/admin.controller";

const router = Router();

router.post("/user", adminController.createUser);
router.put("/user", adminController.updateUser);
router.get("/users", adminController.fetchUsers);
router.get("/user/:userId", adminController.fetchUserData);
router.delete("/user/:userId", adminController.deleteUser);

export { router as adminRouter };
