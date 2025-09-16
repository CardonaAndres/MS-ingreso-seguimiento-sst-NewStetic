import express from "express";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { UserAccesController } from "../controllers/users.controller.js";

const router = express.Router();

router.get('/', authorizeRole([1]), UserAccesController.getAllowedUsers);
router.post('/', authorizeRole([1]), UserAccesController.giveAccess);
router.patch('/:userID', authorizeRole([1]), UserAccesController.updateAccess);

export default router;