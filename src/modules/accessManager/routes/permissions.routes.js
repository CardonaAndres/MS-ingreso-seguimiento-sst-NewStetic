import express from "express";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { PermissionController } from "../controllers/permissions.controller.js";

const router = express.Router();

router.get('/', authorizeRole([1]), PermissionController.getAllPermisions);
router.get('/:roleID', authorizeRole([1]), PermissionController.getPermissionsByRole);

export default router;