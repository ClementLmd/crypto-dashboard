import { Router } from 'express';
import { helloWorldController } from '../controllers/helloWorldController';

const router = Router();

router.get('/', helloWorldController);

export default router;
