import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
  registeredEmailId: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const supportModel = mongoose.models.support || mongoose.model("support", supportSchema);

export default supportModel;
