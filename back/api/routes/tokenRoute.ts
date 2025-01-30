import { Router } from 'express';
import { getTokenPriceController } from '../controllers/tokenController';
import { validateSession } from '../middleware/validateSession';

const router = Router();

router.get('/price/:address', validateSession, getTokenPriceController);

export default router;
