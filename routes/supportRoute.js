import express from 'express';
import { addSupportMessage } from '../controllers/supportController.js'; // Import the controller function

const supportRouter = express.Router();

// POST request to submit a support message
supportRouter.post('/', addSupportMessage);

export default supportRouter;
