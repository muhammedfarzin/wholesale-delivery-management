import { Router } from "express";
import { adminRouter } from "./admin.router";
import { authRouter } from "./auth.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);

export default router;
