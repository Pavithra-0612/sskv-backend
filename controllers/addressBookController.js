import Address from '../models/addressBookModel.js';

// 🟢 Add new address
const addAddress = async (req, res) => {
  const { name, phone, street, number, postcode, city, state, email } = req.body;

  if (!name || !phone || !street || !number || !postcode || !city || !state || !req.body.userId || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // 🔢 Phone and Pincode Validation
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
  }

  if (!/^\d{6}$/.test(postcode)) {
    return res.status(400).json({ message: 'Postcode must be exactly 6 digits.' });
  }

  try {
    const address = new Address({
      userId: req.body.userId,
      email,
      name,
      phone,
      street,
      number,
      postcode,
      city,
      state,
    });

    await address.save();
    res.status(201).json({ message: 'Address added successfully', address });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// 🔵 Get all addresses for logged-in user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🌐 Get addresses by user ID (email)
const getAddressesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const addresses = await Address.find({ userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🌐 Get addresses by user email
// Get addresses by email
const getAddressesByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const addresses = await Address.find({ email }); // Find using the email
    if (addresses.length === 0) {
      return res.status(404).json({ message: 'No addresses found for this email' });
    }
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// 🔴 Delete specific address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    res.status(200).json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✏️ Update specific address
const updateAddress = async (req, res) => {
  const { name, phone, street, number, postcode, city, state, email } = req.body;

  // 🔢 Phone and Pincode Validation
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
  }

  if (!/^\d{6}$/.test(postcode)) {
    return res.status(400).json({ message: 'Postcode must be exactly 6 digits.' });
  }

  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, phone, street, number, postcode, city, state, email },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    res.status(200).json({ message: 'Address updated', address });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export default {
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
  getAddressesByUserId,
  getAddressesByEmail
};
