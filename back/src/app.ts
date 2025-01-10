import dotenv from 'dotenv';
dotenv.config();

import './models/connection';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import usersRoute from './routes/usersRoute';
import addressesRoute from './routes/addressesRoute';
import userSessionRoute from './routes/userSessionRoute';
import tokenRoute from './routes/tokenRoute';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/users', usersRoute);
app.use('/addresses', addressesRoute);
app.use('/auth', userSessionRoute);
app.use('/tokens', tokenRoute);

export default app;
