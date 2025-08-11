import express from "express";
import { ExamLogsController } from "../controllers/examLogs.controller.js";

const router = express.Router();

router.get('/:checkListItemID', ExamLogsController.getLogs);

export default router;