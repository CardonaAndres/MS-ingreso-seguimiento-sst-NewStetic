import express from "express";
import { PermissionController } from "../controllers/permissions.controller.js";

const router = express.Router();

router.get('/', PermissionController.getAllPermisions);
router.get('/:roleID', PermissionController.getPermissionsByRole);

export default router;