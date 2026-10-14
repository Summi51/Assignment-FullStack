const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createEnquiry,
  getUnclaimedEnquiries,
  getMyClaimedEnquiries,
  claimEnquiry,
} = require('../controllers/enquiryController');

const router = express.Router();

// Public - no auth required (the enquiry form)
router.post('/', createEnquiry);

// Protected - employee/counselor routes
router.get('/unclaimed', protect, getUnclaimedEnquiries);
router.get('/my-leads', protect, getMyClaimedEnquiries);
router.patch('/:id/claim', protect, claimEnquiry);

module.exports = router;
