// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  message: String,
  author: String,
  userId: String,
  receiverId: String,
  createdAt: { type: Date, default: Date.now() },
});

const Chat = mongoose.model('messages', chatSchema);
module.exports = Chat;
