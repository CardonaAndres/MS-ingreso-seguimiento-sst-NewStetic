import express from "express";
import { RoleController } from "../controllers/roles.controller.js";

const router = express.Router();

router.get('/', RoleController.getRoles);

export default router;