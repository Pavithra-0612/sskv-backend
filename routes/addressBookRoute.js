import express from 'express';
import authUser from '../middleware/auth.js';
import addressController from '../controllers/addressBookController.js';

const router = express.Router();

// Add address
router.post('/address', authUser, addressController.addAddress);

// Get all user addresses
router.get('/addresses', authUser, addressController.getAddresses);
// Get addresses by userId (email)
router.get('/addresses/:userId', addressController.getAddressesByUserId);

router.get('/addressesemail/:email', authUser, addressController.getAddressesByEmail); 
// Delete address
router.delete('/address/:id', authUser, addressController.deleteAddress);

// Update address
router.put('/address/:id', authUser, addressController.updateAddress);

export default router;
