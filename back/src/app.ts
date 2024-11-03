import dotenv from 'dotenv';
dotenv.config();

import './models/connection';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import helloWorldRoute from './routes/helloWorldRoute';
import usersRoute from './routes/usersRoute';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', helloWorldRoute);
app.use('/users', usersRoute);

export default app;
