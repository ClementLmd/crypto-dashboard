import { Router } from 'express';
import { addAddressController } from '../controllers/addressController';

const router = Router();

router.post('/addAddress', addAddressController);

export default router;
