import express from "express";
import { UserController } from "../controllers/users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', authMiddleware, UserController.getUsersPaginate);
router.get('/:property', authMiddleware, UserController.getUserByProperties);

export default router;