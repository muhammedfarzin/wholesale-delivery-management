import { Router } from "express";
import { adminRouter } from "./admin.router";
import { authRouter } from "./auth.router";
import { authenticateToken } from "../middlewares/authenticate-token.middleware";
import { authorizeRole } from "../middlewares/authorize-role.middleware";
import { driverRouter } from "./driver.router";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/admin", authenticateToken, authorizeRole("admin"), adminRouter);
router.use("/api/driver", authenticateToken, authorizeRole("truck_driver"), driverRouter);

export default router;
