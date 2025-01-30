import { Router } from 'express';
import {
  addAddressController,
  addSolanaAddressController,
  deleteAddressController,
  getUserAddressesController,
} from '../controllers/addressController';
import { validateSession } from '../middleware/validateSession';

const router = Router();

router.post('/addAddress', validateSession, addAddressController);
router.post('/addAddress/solana', validateSession, addSolanaAddressController);
router.delete('/deleteAddress', validateSession, deleteAddressController);
router.get('/getUserAddresses', validateSession, getUserAddressesController);

export default router;
