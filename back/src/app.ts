import dotenv from 'dotenv';
dotenv.config();

import './models/connection';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import usersRoute from './routes/usersRoute';
import addressesRoute from './routes/addressesRoute';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/users', usersRoute);
app.use('/addresses', addressesRoute);

export default app;
