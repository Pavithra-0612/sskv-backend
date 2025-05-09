import Support from '../models/supportModel.js';

// 🟢 Add new support message
const addSupportMessage = async (req, res) => {
  const { registeredEmailId, name, phoneNumber, emailId, message } = req.body;

  // Validate required fields
  if (!registeredEmailId || !name || !phoneNumber || !emailId || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // 🔢 Phone Number Validation (should be 10 digits)
  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
  }

  try {
    // Create a new support message
    const supportMessage = new Support({
      registeredEmailId,
      name,
      phoneNumber,
      emailId,
      message,
    });

    // Save the support message to the database
    await supportMessage.save();

    res.status(201).json({ message: 'Message submitted successfully', supportMessage });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export { addSupportMessage };
