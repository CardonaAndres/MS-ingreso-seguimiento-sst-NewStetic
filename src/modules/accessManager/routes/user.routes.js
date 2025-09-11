import express from "express";
import { UserAccesController } from "../controllers/users.controller.js";

const router = express.Router();

router.get('/', UserAccesController.getAllowedUsers);
router.post('/', UserAccesController.giveAccess);
router.patch('/:userID', UserAccesController.updateAccess);

export default router;