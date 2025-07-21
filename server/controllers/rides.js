const Ride = require('../models/Ride');
const User = require('../models/User');

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
exports.createRide = async (req, res) => {
  try {
    // Add user to req.body
    req.body.driver = req.user.id;

    const ride = await Ride.create(req.body);

    res.status(201).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all rides
// @route   GET /api/rides
// @access  Public
exports.getRides = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Ride.find(JSON.parse(queryStr)).populate({
      path: 'driver',
      select: 'name profilePicture'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Ride.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const rides = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: rides.length,
      pagination,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
// @access  Public
exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate({
      path: 'driver',
      select: 'name profilePicture phoneNumber'
    }).populate({
      path: 'passengers.user',
      select: 'name profilePicture'
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update ride
// @route   PUT /api/rides/:id
// @access  Private
exports.updateRide = async (req, res) => {
  try {
    let ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Make sure user is ride owner
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this ride`
      });
    }

    ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete ride
// @route   DELETE /api/rides/:id
// @access  Private
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Make sure user is ride owner
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this ride`
      });
    }

    await ride.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Request to join a ride
// @route   POST /api/rides/:id/join
// @access  Private
exports.joinRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Check if ride is full
    const approvedPassengers = ride.passengers.filter(
      passenger => passenger.status === 'approved'
    ).length;

    if (approvedPassengers >= ride.availableSeats) {
      return res.status(400).json({
        success: false,
        message: 'This ride is already full'
      });
    }

    // Check if user is already in the passengers list
    const alreadyJoined = ride.passengers.some(
      passenger => passenger.user.toString() === req.user.id
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested to join this ride'
      });
    }

    // Add user to passengers array
    ride.passengers.push({
      user: req.user.id,
      status: 'pending'
    });

    await ride.save();

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Approve or reject passenger request
// @route   PUT /api/rides/:id/passengers/:userId
// @access  Private
exports.respondToJoinRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (approved or rejected)'
      });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Make sure user is ride owner
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this ride`
      });
    }

    // Find the passenger
    const passengerIndex = ride.passengers.findIndex(
      passenger => passenger.user.toString() === req.params.userId
    );

    if (passengerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Passenger with id ${req.params.userId} not found in this ride`
      });
    }

    // Update passenger status
    ride.passengers[passengerIndex].status = status;

    await ride.save();

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get rides for a specific user (as driver or passenger)
// @route   GET /api/rides/user
// @access  Private
exports.getUserRides = async (req, res) => {
  try {
    // Get rides where user is the driver
    const driverRides = await Ride.find({ driver: req.user.id }).sort('-createdAt');

    // Get rides where user is a passenger
    const passengerRides = await Ride.find({
      'passengers.user': req.user.id
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        driverRides,
        passengerRides
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get rides offered by the current user
// @route   GET /api/rides/user/offered
// @access  Private
exports.getUserOfferedRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get rides joined by the current user
// @route   GET /api/rides/user/joined
// @access  Private
exports.getUserJoinedRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      'passengers.user': req.user.id,
      'passengers.status': 'approved'
    }).populate({
      path: 'driver',
      select: 'name profilePicture'
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get rides with pending requests by the current user
// @route   GET /api/rides/user/pending
// @access  Private
exports.getUserPendingRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      'passengers.user': req.user.id,
      'passengers.status': 'pending'
    }).populate({
      path: 'driver',
      select: 'name profilePicture'
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Leave a joined ride
// @route   POST /api/rides/:id/leave
// @access  Private
exports.leaveRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Check if user is in the passengers list
    const passengerIndex = ride.passengers.findIndex(
      passenger => passenger.user.toString() === req.user.id && passenger.status === 'approved'
    );

    if (passengerIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not a passenger on this ride'
      });
    }

    // Remove user from passengers array
    ride.passengers.splice(passengerIndex, 1);

    await ride.save();

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Cancel a join request
// @route   POST /api/rides/:id/cancel
// @access  Private
exports.cancelJoinRequest = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Check if user has a pending request
    const passengerIndex = ride.passengers.findIndex(
      passenger => passenger.user.toString() === req.user.id && passenger.status === 'pending'
    );

    if (passengerIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You do not have a pending request for this ride'
      });
    }

    // Remove user from passengers array
    ride.passengers.splice(passengerIndex, 1);

    await ride.save();

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Calculate route match percentage
// @route   POST /api/rides/match
// @access  Private
exports.calculateRouteMatch = async (req, res) => {
  try {
    const { startLocation, endLocation } = req.body;

    if (!startLocation || !endLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start and end locations'
      });
    }

    // Get all scheduled rides
    const rides = await Ride.find({ status: 'scheduled' }).populate({
      path: 'driver',
      select: 'name profilePicture'
    });

    // Calculate match percentage for each ride
    const matchedRides = rides.map(ride => {
      const matchPercentage = ride.calculateRouteMatch(startLocation, endLocation);
      
      return {
        ...ride.toObject(),
        matchPercentage
      };
    });

    // Sort by match percentage (highest first)
    matchedRides.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      count: matchedRides.length,
      data: matchedRides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};