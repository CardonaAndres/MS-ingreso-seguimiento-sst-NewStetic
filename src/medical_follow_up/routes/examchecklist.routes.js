import express from "express";
import { ExamCheckListController } from "../controllers/examcheklist.controller";

const router = express.Router();

router.get('/', ExamCheckListController.getCheckList);
router.post('/', ExamCheckListController.getCheckList);
router.patch('/ChekListItemID', ExamCheckListController.getCheckList);

export default router;