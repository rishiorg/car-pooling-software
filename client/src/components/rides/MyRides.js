import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const MyRides = () => {
  const { token } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('offered');
  const [offeredRides, setOfferedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        // Fetch rides offered by the user
        const offeredRes = await axios.get(
          'http://localhost:5000/api/rides/user/offered',
          config
        );
        setOfferedRides(offeredRes.data.data);
        
        // Fetch rides joined by the user
        const joinedRes = await axios.get(
          'http://localhost:5000/api/rides/user/joined',
          config
        );
        setJoinedRides(joinedRes.data.data);
        
        // Fetch rides with pending requests by the user
        const pendingRes = await axios.get(
          'http://localhost:5000/api/rides/user/pending',
          config
        );
        setPendingRides(pendingRes.data.data);
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching your rides. Please try again.');
        setLoading(false);
      }
    };

    fetchMyRides();
  }, [token]);

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to delete this ride?')) {
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.delete(`http://localhost:5000/api/rides/${rideId}`, config);
      
      // Update the offered rides list
      setOfferedRides(offeredRides.filter(ride => ride._id !== rideId));
    } catch (err) {
      setError('Error deleting ride. Please try again.');
    }
  };

  const handleCancelRequest = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel your request?')) {
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.post(
        `http://localhost:5000/api/rides/${rideId}/cancel`,
        {},
        config
      );
      
      // Update the pending rides list
      setPendingRides(pendingRides.filter(ride => ride._id !== rideId));
    } catch (err) {
      setError('Error canceling request. Please try again.');
    }
  };

  const handleLeaveRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to leave this ride?')) {
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.post(
        `http://localhost:5000/api/rides/${rideId}/leave`,
        {},
        config
      );
      
      // Update the joined rides list
      setJoinedRides(joinedRides.filter(ride => ride._id !== rideId));
    } catch (err) {
      setError('Error leaving ride. Please try again.');
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

  const renderRideCard = (ride, type) => {
    const isPast = new Date(ride.departureTime) < new Date();
    
    return (
      <div className="col-md-6 mb-4" key={ride._id}>
        <div className={`card h-100 ${isPast ? 'border-secondary' : ''}`}>
          {isPast && (
            <div className="card-header bg-secondary text-white">
              Past Ride
            </div>
          )}
          <div className="card-body">
            <h5 className="card-title">
              {ride.startLocation} → {ride.endLocation}
            </h5>
            <p className="card-text">
              <strong>Departure:</strong> {formatDate(ride.departureTime)}
            </p>
            <p className="card-text">
              <strong>Available Seats:</strong> {ride.availableSeats - ride.passengers.filter(p => p.status === 'approved').length} of {ride.availableSeats}
            </p>
            <p className="card-text">
              <strong>Price per Seat:</strong> ${ride.pricePerSeat}
            </p>
            
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Link to={`/rides/${ride._id}`} className="btn btn-outline-primary">
                View Details
              </Link>
              
              {type === 'offered' && !isPast && (
                <div>
                  <Link to={`/rides/${ride._id}/edit`} className="btn btn-outline-secondary me-2">
                    Edit
                  </Link>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteRide(ride._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
              
              {type === 'pending' && !isPast && (
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => handleCancelRequest(ride._id)}
                >
                  Cancel Request
                </button>
              )}
              
              {type === 'joined' && !isPast && (
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => handleLeaveRide(ride._id)}
                >
                  Leave Ride
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Rides</h2>
        <Link to="/rides/create" className="btn btn-primary">
          Create New Ride
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'offered' ? 'active' : ''}`}
            onClick={() => setActiveTab('offered')}
          >
            Rides Offered ({offeredRides.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'joined' ? 'active' : ''}`}
            onClick={() => setActiveTab('joined')}
          >
            Rides Joined ({joinedRides.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests ({pendingRides.length})
          </button>
        </li>
      </ul>
      
      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'offered' ? 'active' : ''}`}>
          {offeredRides.length === 0 ? (
            <div className="alert alert-info" role="alert">
              You haven't offered any rides yet. <Link to="/rides/create">Create a ride</Link> to get started!
            </div>
          ) : (
            <div className="row">
              {offeredRides.map(ride => renderRideCard(ride, 'offered'))}
            </div>
          )}
        </div>
        
        <div className={`tab-pane ${activeTab === 'joined' ? 'active' : ''}`}>
          {joinedRides.length === 0 ? (
            <div className="alert alert-info" role="alert">
              You haven't joined any rides yet. <Link to="/rides">Find a ride</Link> to join!
            </div>
          ) : (
            <div className="row">
              {joinedRides.map(ride => renderRideCard(ride, 'joined'))}
            </div>
          )}
        </div>
        
        <div className={`tab-pane ${activeTab === 'pending' ? 'active' : ''}`}>
          {pendingRides.length === 0 ? (
            <div className="alert alert-info" role="alert">
              You don't have any pending ride requests.
            </div>
          ) : (
            <div className="row">
              {pendingRides.map(ride => renderRideCard(ride, 'pending'))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRides;