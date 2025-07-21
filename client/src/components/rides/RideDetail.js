import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const RideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinRequestStatus, setJoinRequestStatus] = useState(null);
  const [routeMatch, setRouteMatch] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rides/${id}`);
        setRide(res.data.data);
        
        // Check if user has already requested to join this ride
        if (user && res.data.data.passengers) {
          const userRequest = res.data.data.passengers.find(
            (passenger) => passenger.user.toString() === user._id
          );
          if (userRequest) {
            setJoinRequestStatus(userRequest.status);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching ride details. Please try again.');
        setLoading(false);
      }
    };

    fetchRide();
  }, [id, user]);

  useEffect(() => {
    // Calculate route match if user is logged in and ride is loaded
    const calculateRouteMatch = async () => {
      if (!user || !ride) return;
      
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };
        
        const res = await axios.get(
          `http://localhost:5000/api/rides/${id}/match`,
          config
        );
        
        setRouteMatch(res.data.data.matchPercentage);
      } catch (err) {
        console.error('Error calculating route match:', err);
      }
    };
    
    calculateRouteMatch();
  }, [id, user, ride, token]);

  const handleJoinRequest = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/rides/${id}` } });
      return;
    }
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.post(
        `http://localhost:5000/api/rides/${id}/join`,
        {},
        config
      );
      
      setJoinRequestStatus('pending');
    } catch (err) {
      setError('Error sending join request. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="container">
        <div className="alert alert-warning" role="alert">
          Ride not found.
        </div>
      </div>
    );
  }

  const isUserDriver = user && ride.driver._id === user._id;
  const availableSeats = ride.availableSeats - ride.passengers.filter(p => p.status === 'approved').length;
  const canJoin = !isUserDriver && !joinRequestStatus && availableSeats > 0;

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">{ride.startLocation} → {ride.endLocation}</h2>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Ride Details</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Departure Time</span>
                  <span className="badge bg-primary rounded-pill">{formatDate(ride.departureTime)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Available Seats</span>
                  <span className="badge bg-primary rounded-pill">{availableSeats} of {ride.availableSeats}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Price per Seat</span>
                  <span className="badge bg-primary rounded-pill">${ride.pricePerSeat}</span>
                </li>
                {routeMatch !== null && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Route Match</span>
                    <span className="badge bg-success rounded-pill">{routeMatch}%</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="col-md-6">
              <h4>Vehicle Information</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Model</span>
                  <span>{ride.vehicleDetails.model}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Color</span>
                  <span>{ride.vehicleDetails.color}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>License Plate</span>
                  <span>{ride.vehicleDetails.licensePlate}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Driver Information</h4>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{ride.driver.name}</h5>
                  <p className="card-text">
                    <strong>Email:</strong> {user ? ride.driver.email : "*****@*****.com"}
                  </p>
                  <p className="card-text">
                    <strong>Phone:</strong> {user ? ride.driver.phone : "***-***-****"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <h4>Preferences</h4>
              <div className="d-flex flex-wrap">
                <div className="badge bg-secondary me-2 mb-2 p-2">
                  {ride.preferences.isSmoking ? "Smoking Allowed" : "No Smoking"}
                </div>
                <div className="badge bg-secondary me-2 mb-2 p-2">
                  {ride.preferences.isPetFriendly ? "Pet Friendly" : "No Pets"}
                </div>
                <div className="badge bg-secondary me-2 mb-2 p-2">
                  {ride.preferences.isMusic ? "Music Allowed" : "No Music"}
                </div>
                {ride.preferences.femaleOnly && (
                  <div className="badge bg-secondary me-2 mb-2 p-2">Female Only</div>
                )}
              </div>
              
              {ride.preferences.additionalNotes && (
                <div className="mt-3">
                  <h5>Additional Notes</h5>
                  <p>{ride.preferences.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            {canJoin && (
              <button 
                className="btn btn-primary" 
                onClick={handleJoinRequest}
              >
                Request to Join
              </button>
            )}
            
            {joinRequestStatus === 'pending' && (
              <button className="btn btn-secondary" disabled>
                Join Request Pending
              </button>
            )}
            
            {joinRequestStatus === 'approved' && (
              <button className="btn btn-success" disabled>
                Joined
              </button>
            )}
            
            {joinRequestStatus === 'rejected' && (
              <button className="btn btn-danger" disabled>
                Request Rejected
              </button>
            )}
            
            {isUserDriver && (
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate(`/rides/${id}/edit`)}
              >
                Edit Ride
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetail;