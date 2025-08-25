import express from "express";
import { UserController } from "../controllers/users.controller.js";

const router = express.Router();

router.get('/', UserController.getUsersPaginate);
router.get('/idles', UserController.getUsersIdlesPaginate);
router.get('/:property', UserController.getUsersByProperties);
router.get('/idles/:property', UserController.getUsersIdlesByProperties);
router.get('/history/:docNumber', UserController.getWorkHistoryWork);
router.get('/to-reports', UserController.getUsersToReport);

export default router;