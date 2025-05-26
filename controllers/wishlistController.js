import Wishlist from '../models/wishlistModel.js';
import mongoose from 'mongoose';

// 🟢 Add item to wishlist
const addToWishlist = async (req, res) => {
  const { email, productId } = req.body;

  if (!email || !productId) {
    return res.status(400).json({ message: 'Email and productId are required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid productId format.' });
  }

  try {
    // Find wishlist doc by email
    let wishlist = await Wishlist.findOne({ email });

    if (!wishlist) {
      // Create new wishlist doc if not exists
      wishlist = new Wishlist({ email, items: [] });
    }

    // Check if productId already in wishlist items
    const exists = wishlist.items.some(item => item.productId.equals(productId));
    if (exists) {
      return res.status(409).json({ message: 'Product already in wishlist.' });
    }

    // Add productId to items array
    wishlist.items.push({ productId });
    await wishlist.save();

    res.status(201).json({ message: 'Added to wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




// 🔵 Get wishlist items by email
const getWishlistByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ email }).populate('items.productId');

    if (!wishlist) {
      return res.status(404).json({ message: 'No wishlist found for this user' });
    }

    // Optional: format response
    const formattedItems = wishlist.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
    }));

    res.status(200).json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// 🔴 Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  const { email, productId } = req.body;

  if (!email || !productId) {
    return res.status(400).json({ message: 'Email and productId are required.' });
  }

  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { email },
      { $pull: { items: { productId: productId } } }, // Remove item from items array
      { new: true } // Return updated document
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: 'Wishlist not found for this email' });
    }

    res.status(200).json({ message: 'Removed from wishlist', wishlist: updatedWishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export default {
  addToWishlist,
  getWishlistByEmail,
  removeFromWishlist
};
