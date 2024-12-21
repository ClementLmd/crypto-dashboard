import { Router } from 'express';
import { addAddressController, deleteAddressController } from '../controllers/addressController';

const router = Router();

router.post('/addAddress', addAddressController);
router.delete('/deleteAddress', deleteAddressController);

export default router;
