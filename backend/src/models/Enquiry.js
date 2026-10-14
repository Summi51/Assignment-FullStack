const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    courseInterest: { type: String, trim: true },
    message: { type: String, trim: true },
    isClaimed: { type: Boolean, default: false },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    claimedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
