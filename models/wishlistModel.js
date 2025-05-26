import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },  // One document per user (email)
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      addedAt: { type: Date, default: Date.now }  // Optional: track when item was added
    }
  ]
}, { timestamps: true });

const wishlistModel = mongoose.models.wishlist || mongoose.model('wishlist', wishlistSchema);

export default wishlistModel;
