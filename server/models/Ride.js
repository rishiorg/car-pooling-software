const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startLocation: {
    type: String,
    required: [true, 'Please add a start location']
  },
  endLocation: {
    type: String,
    required: [true, 'Please add an end location']
  },
  departureTime: {
    type: Date,
    required: [true, 'Please add a departure time']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please add number of available seats'],
    min: [1, 'Must have at least 1 available seat']
  },
  vehicleDetails: {
    model: {
      type: String,
      required: [true, 'Please add vehicle model']
    },
    licensePlate: {
      type: String,
      required: [true, 'Please add license plate']
    }
  },
  preferences: {
    isSmoking: { type: Boolean, default: false },
    isPetFriendly: { type: Boolean, default: false },
    isMusic: { type: Boolean, default: true },
    femaleOnly: { type: Boolean, default: false }
  },
  passengers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    }
  ],
  routeMatchPercentage: {
    type: Map,
    of: Number,
    default: {}
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate route match percentage for a rider
RideSchema.methods.calculateRouteMatch = function(riderStartLocation, riderEndLocation) {
  // This is a simplified implementation
  // In a real app, you would use a mapping API to calculate actual route similarity
  
  // For demo purposes, we'll use a simple string comparison
  const startMatch = this.startLocation.toLowerCase() === riderStartLocation.toLowerCase() ? 100 : 0;
  const endMatch = this.endLocation.toLowerCase() === riderEndLocation.toLowerCase() ? 100 : 0;
  
  return (startMatch + endMatch) / 2;
};

module.exports = mongoose.model('Ride', RideSchema);