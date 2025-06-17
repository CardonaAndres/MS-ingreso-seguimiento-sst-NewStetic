import cors from 'cors';
import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import staffRouter from '../users/routes/users.routes.js'
import { errorHandler } from '../middlewares/error.handler.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser(String(process.env.COOKIE_SECRET)));

app.use('/API/v1/staff', staffRouter);

app.use(errorHandler);

export default app;