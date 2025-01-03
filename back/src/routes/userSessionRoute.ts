import { Router } from 'express';
import {
  checkSessionController,
  createSessionController,
  invalidateSessionController,
} from '../controllers/userSessionController';

const router = Router();

router.get('/check', checkSessionController);
router.post('/login', createSessionController);
router.post('/logout', invalidateSessionController);

export default router;
