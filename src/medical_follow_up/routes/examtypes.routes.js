import express from "express";
import { ExamTypesController } from "../controllers/examtypes.controller.js";

const router = express.Router();

router.get('/', ExamTypesController.getExamTypes);
router.post('/', ExamTypesController.createExamType);
router.patch('/:examTypeId', ExamTypesController.updateExamType);

export default router;