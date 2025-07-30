import cors from 'cors';
import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import staffRouter from '../../users/routes/users.routes.js'
import examTypesRouter from '../../medical_follow_up/routes/examtypes.routes.js';
import examChekListRouter from '../../medical_follow_up/routes/examtypes.routes.js';
import { errorHandler } from '../middlewares/error.handler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const app = express();

app.use(cors({
    origin: [ process.env.SST_CLIENT ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser(String(process.env.COOKIE_SECRET)));

app.use('/API-SST/v1/staff', authMiddleware, staffRouter);
app.use('/API-SST/v1/examtypes', authMiddleware, examTypesRouter);
app.use('/API-SST/v1/exam-checklist', authMiddleware, examChekListRouter);

app.use(errorHandler);

export default app;