const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  data: {
    type: Object,
    required: true
  },
  templateUsed: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
