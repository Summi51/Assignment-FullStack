const Enquiry = require('../models/Enquiry');

// @route POST /api/enquiries  (PUBLIC - no auth)
const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, courseInterest, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }

    const enquiry = await Enquiry.create({ name, email, phone, courseInterest, message });
    res.status(201).json(enquiry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/enquiries/unclaimed  (PROTECTED - public enquiries visible to all employees)
const getUnclaimedEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ isClaimed: false }).sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/enquiries/my-leads  (PROTECTED - leads claimed by logged-in employee)
const getMyClaimedEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ claimedBy: req.employee.id }).sort({ claimedAt: -1 });
    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route PATCH /api/enquiries/:id/claim  (PROTECTED)
const claimEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Atomic update: only claim if currently unclaimed, to avoid race conditions
    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: id, isClaimed: false },
      { isClaimed: true, claimedBy: req.employee.id, claimedAt: new Date() },
      { new: true }
    );

    if (!enquiry) {
      const exists = await Enquiry.findById(id);
      if (!exists) {
        return res.status(404).json({ message: 'Enquiry not found' });
      }
      return res.status(409).json({ message: 'Enquiry has already been claimed' });
    }

    res.status(200).json(enquiry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createEnquiry,
  getUnclaimedEnquiries,
  getMyClaimedEnquiries,
  claimEnquiry,
};
