const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  isFreeTrial: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Magazine', magazineSchema); 