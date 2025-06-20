import express from "express";
import { UserController } from "../controllers/users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', authMiddleware, UserController.getUsersPaginate);
router.get('/idles', authMiddleware, UserController.getUsersIdlesPaginate);
router.get('/:property', authMiddleware, UserController.getUsersByProperties);
router.get('/idles/:property', authMiddleware, UserController.getUsersIdlesByProperties);

export default router;