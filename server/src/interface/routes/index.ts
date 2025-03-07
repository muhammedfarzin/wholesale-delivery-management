import { Router } from "express";
import { adminRouter } from "./admin.router";
import { authRouter } from "./auth.router";
import { authenticateToken } from "../middlewares/authenticate-token.middleware";
import { authorizeRole } from "../middlewares/authorize-role.middleware";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/admin", authenticateToken, authorizeRole("admin"), adminRouter);

export default router;
