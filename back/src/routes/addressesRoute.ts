import { Router } from 'express';
import { addAddressController, deleteAddressController } from '../controllers/addressController';
import { validateSession } from '../middleware/validateSession';

const router = Router();

router.post('/addAddress', validateSession, addAddressController);
router.delete('/deleteAddress', deleteAddressController);

export default router;
