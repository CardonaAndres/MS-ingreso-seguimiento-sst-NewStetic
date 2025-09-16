import express from "express";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { RoleController } from "../controllers/roles.controller.js";

const router = express.Router();

router.get('/', authorizeRole([1]), RoleController.getRoles);
router.post('/', authorizeRole([1]), RoleController.createRole);
router.patch('/:roleID', authorizeRole([1]), RoleController.updateRole);

export default router;