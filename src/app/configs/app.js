import path from 'path';
import cors from 'cors';
import express from "express";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import staffRouter from '../../modules/users/routes/users.routes.js';
import examTypesRouter from '../../modules/medicalFollowUp/routes/examTypes.routes.js';
import examRecords from '../../modules/examRecords/routes/examRecords.routes.js';
import examLogs from '../../modules/examRecords/routes/examLogs.routes.js';
import examChekListRouter from '../../modules/medicalFollowUp/routes/examCheckList.routes.js';
import rolesRouter from '../../modules/accessManager/routes/role.routes.js';
import permissionsRouter from '../../modules/accessManager/routes/permissions.routes.js';
import usersAccessRouter from '../../modules/accessManager/routes/user.routes.js';
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

app.use('/API-SST/v1/roles', authMiddleware, rolesRouter);
app.use('/API-SST/v1/roles-permissions', authMiddleware, permissionsRouter);
app.use('/API-SST/v1/allowed-users', authMiddleware, usersAccessRouter);

app.use('/API-SST/v1/staff', authMiddleware, staffRouter);
app.use('/API-SST/v1/examtypes', authMiddleware, examTypesRouter);
app.use('/API-SST/v1/exam-checklist', authMiddleware, examChekListRouter);
app.use('/API-SST/v1/exam-records', authMiddleware, examRecords);
app.use('/API-SST/v1/exam-logs', authMiddleware, examLogs);

app.use(errorHandler);

export default app;