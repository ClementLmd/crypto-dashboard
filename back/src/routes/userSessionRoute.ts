import { Router } from 'express';
import {
  createSessionController,
  invalidateSessionController,
} from '../controllers/userSessionController';

const router = Router();

router.post('/login', createSessionController);
router.post('/logout', invalidateSessionController);

export default router;
