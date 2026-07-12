const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true
  },
  to: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    default: 'general',
    trim: true
  },
  type: {
    type: String,
    enum: ['message', 'join', 'leave'],
    default: 'message'
  },
  readBy: [{
    type: String
  }],
  deliveredTo: [{
    type: String
  }]
}, {
  timestamps: true
});

messageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
