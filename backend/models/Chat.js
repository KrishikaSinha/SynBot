const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'New Chat',
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);