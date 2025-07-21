const express = require('express');
const {
  getRides,
  getRide,
  createRide,
  updateRide,
  deleteRide,
  joinRide,
  respondToJoinRequest,
  getUserRides,
  getUserOfferedRides,
  getUserJoinedRides,
  getUserPendingRides,
  leaveRide,
  cancelJoinRequest,
  calculateRouteMatch
} = require('../controllers/rides');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
  .get(getRides)
  .post(protect, createRide);

router.route('/user')
  .get(protect, getUserRides);

router.route('/user/offered')
  .get(protect, getUserOfferedRides);

router.route('/user/joined')
  .get(protect, getUserJoinedRides);

router.route('/user/pending')
  .get(protect, getUserPendingRides);

router.route('/match')
  .post(protect, calculateRouteMatch);

router.route('/:id')
  .get(getRide)
  .put(protect, updateRide)
  .delete(protect, deleteRide);

router.route('/:id/join')
  .post(protect, joinRide);

router.route('/:id/leave')
  .post(protect, leaveRide);

router.route('/:id/cancel')
  .post(protect, cancelJoinRequest);

router.route('/:id/passengers/:userId')
  .put(protect, respondToJoinRequest);

module.exports = router;