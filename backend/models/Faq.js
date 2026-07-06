const mongoose = require('mongoose');

// Har FAQ document mein keywords (jin words se match hoga)
// aur ek answer hoga jo user ko reply mein milega
const faqSchema = new mongoose.Schema({
  keywords: {
    type: [String],   // array of strings, e.g. ["leave", "vacation", "holiday"]
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,      // e.g. "HR", "IT", "General"
    default: 'General',
  },
}, { timestamps: true });

module.exports = mongoose.model('Faq', faqSchema);