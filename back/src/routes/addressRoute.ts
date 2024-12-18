import { Router } from 'express';
import {
  signUpController,
  getAllUsersController,
  getUserByIdController,
  signInController,
} from '../controllers/userController';

const router = Router();

router.post('/signup', signUpController);
router.post('/signin', signInController);
router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);

export default router;
