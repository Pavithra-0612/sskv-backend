import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // userId is email (to identify the user)
  email: { type: String, required: true },   // New email field
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  postcode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
