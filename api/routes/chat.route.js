import express from 'express';
import { 
  createMessage, 
  getAllMessages, 
  getMessageById, 
  updateMessage, 
  deleteMessage 
} from '../controllers/chat.controller.js';

const router = express.Router();

// Create a new message
router.post('/create', createMessage);

// Get all messages
router.get('/', getAllMessages);

// Get a single message by ID
router.get('/:id', getMessageById);

// Update a message
router.put('/:id', updateMessage);

// Delete a message
router.delete('/:id', deleteMessage);

export default router;
