import dotenv from 'dotenv';
dotenv.config();

import './models/connection';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validateSession } from './middleware/validateSession';

// Import all controllers
import {
  signUpController,
  getAllUsersController,
  getUserByIdController,
} from './controllers/userController';

import {
  addAddressController,
  deleteAddressController,
  getUserAddressesController,
  addSolanaAddressController,
} from './controllers/addressController';

import {
  createSessionController,
  invalidateSessionController,
  checkSessionController,
} from './controllers/userSessionController';

import { getTokenPriceController } from './controllers/tokenController';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// User routes
app.post('/users/signup', signUpController);
app.get('/users', getAllUsersController);
app.get('/users/:id', getUserByIdController);

// Session routes
app.get('/auth/check', checkSessionController);
app.post('/auth/login', createSessionController);
app.post('/auth/logout', invalidateSessionController);

// Address routes (with auth)
app.post('/addresses/addAddress', validateSession, addAddressController);
app.post('/addresses/addAddress/solana', validateSession, addSolanaAddressController);
app.delete('/addresses/deleteAddress', validateSession, deleteAddressController);
app.get('/addresses/getUserAddresses', validateSession, getUserAddressesController);

// Token routes (with auth)
app.get('/tokens/price/:address', validateSession, getTokenPriceController);

export default app;
