import path from 'path';
import cors from 'cors';
import express from "express";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import staffRouter from '../../modules/users/routes/users.routes.js'
import examTypesRouter from '../../modules/medicalFollowUp/routes/examTypes.routes.js';
import examRecords from '../../modules/examRecords/routes/examRecords.routes.js';
import examChekListRouter from '../../modules/medicalFollowUp/routes/examCheckList.routes.js';
import { errorHandler } from '../middlewares/error.handler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: [ process.env.SST_CLIENT ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(String(process.env.COOKIE_SECRET)));

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/API-SST/v1/staff', authMiddleware, staffRouter);
app.use('/API-SST/v1/examtypes', authMiddleware, examTypesRouter);
app.use('/API-SST/v1/exam-checklist', authMiddleware, examChekListRouter);
app.use('/API-SST/v1/exam-records', authMiddleware, examRecords);

app.use(errorHandler);

export default app;