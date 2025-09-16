import express from "express";
import { RoleController } from "../controllers/roles.controller.js";

const router = express.Router();

router.get('/', RoleController.getRoles);
router.post('/', RoleController.createRole);
router.patch('/:roleID', RoleController.updateRole);

export default router;