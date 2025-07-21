import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RideList = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    startLocation: '',
    endLocation: '',
    departureDate: ''
  });

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rides');
        setRides(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching rides. Please try again.');
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build query string from search params
      const queryParams = new URLSearchParams();
      if (searchParams.startLocation) {
        queryParams.append('startLocation', searchParams.startLocation);
      }
      if (searchParams.endLocation) {
        queryParams.append('endLocation', searchParams.endLocation);
      }
      if (searchParams.departureDate) {
        const date = new Date(searchParams.departureDate);
        queryParams.append('departureTime[gte]', date.toISOString());
        
        // Set end of day for the date range
        date.setHours(23, 59, 59, 999);
        queryParams.append('departureTime[lte]', date.toISOString());
      }

      const res = await axios.get(`http://localhost:5000/api/rides?${queryParams}`);
      setRides(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error searching rides. Please try again.');
      setLoading(false);
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

  return (
    <div className="container">
      <h2 className="mb-4">Find Available Rides</h2>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="startLocation" className="form-label">From</label>
                <input
                  type="text"
                  className="form-control"
                  id="startLocation"
                  name="startLocation"
                  placeholder="Starting location"
                  value={searchParams.startLocation}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="endLocation" className="form-label">To</label>
                <input
                  type="text"
                  className="form-control"
                  id="endLocation"
                  name="endLocation"
                  placeholder="Destination"
                  value={searchParams.endLocation}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="departureDate" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="departureDate"
                  name="departureDate"
                  value={searchParams.departureDate}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {rides.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No rides available matching your criteria. Try adjusting your search or check back later.
        </div>
      ) : (
        <div className="row">
          {rides.map((ride) => (
            <div className="col-md-6 mb-4" key={ride._id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">
                      {ride.startLocation} → {ride.endLocation}
                    </h5>
                    <span className="badge bg-primary">
                      {ride.availableSeats - ride.passengers.filter(p => p.status === 'approved').length} seats left
                    </span>
                  </div>
                  <p className="card-text">
                    <strong>Departure:</strong> {formatDate(ride.departureTime)}
                  </p>
                  <p className="card-text">
                    <strong>Vehicle:</strong> {ride.vehicleDetails.model}
                  </p>
                  <div className="d-flex flex-wrap mb-3">
                    {ride.preferences.isSmoking && (
                      <span className="badge bg-secondary me-1 mb-1">Smoking</span>
                    )}
                    {ride.preferences.isPetFriendly && (
                      <span className="badge bg-secondary me-1 mb-1">Pet Friendly</span>
                    )}
                    {ride.preferences.isMusic && (
                      <span className="badge bg-secondary me-1 mb-1">Music</span>
                    )}
                    {ride.preferences.femaleOnly && (
                      <span className="badge bg-secondary me-1 mb-1">Female Only</span>
                    )}
                  </div>
                  <Link to={`/rides/${ride._id}`} className="btn btn-outline-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideList;