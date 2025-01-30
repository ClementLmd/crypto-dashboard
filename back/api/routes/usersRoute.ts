import { Router } from 'express';
import {
  signUpController,
  getAllUsersController,
  getUserByIdController,
} from '../controllers/userController';

const router = Router();

router.post('/signup', signUpController);
router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);

export default router;
