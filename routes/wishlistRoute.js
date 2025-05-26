import express from 'express';
import wishlistController from '../controllers/wishlistController.js';

const wishlistrouter = express.Router();

wishlistrouter.post('/add', wishlistController.addToWishlist);
wishlistrouter.get('/:email', wishlistController.getWishlistByEmail);
wishlistrouter.delete('/remove', wishlistController.removeFromWishlist);

export default wishlistrouter;
