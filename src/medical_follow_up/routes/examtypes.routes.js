import express from "express";
import { ExamTypesController } from "../controllers/examtypes.controller.js";

const router = express.Router();

router.get('/', ExamTypesController.getExamTypes);

export default router;