import { Router } from 'express';
import {
  addAddressController,
  deleteAddressController,
  getUserAddressesController,
} from '../controllers/addressController';
import { validateSession } from '../middleware/validateSession';

const router = Router();

router.post('/addAddress', validateSession, addAddressController);
router.delete('/deleteAddress', validateSession, deleteAddressController);
router.get('/getAddresses', validateSession, getUserAddressesController);

export default router;
