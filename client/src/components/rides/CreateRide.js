import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const CreateRide = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    departureDate: '',
    departureTime: '',
    availableSeats: 1,
    pricePerSeat: 0,
    vehicleModel: '',
    vehicleColor: '',
    vehicleLicensePlate: '',
    isSmoking: false,
    isPetFriendly: false,
    isMusic: false,
    femaleOnly: false,
    additionalNotes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Combine date and time for departureTime
      const dateTime = new Date(`${formData.departureDate}T${formData.departureTime}`);
      
      const rideData = {
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        departureTime: dateTime.toISOString(),
        availableSeats: parseInt(formData.availableSeats),
        pricePerSeat: parseFloat(formData.pricePerSeat),
        vehicleDetails: {
          model: formData.vehicleModel,
          color: formData.vehicleColor,
          licensePlate: formData.vehicleLicensePlate
        },
        preferences: {
          isSmoking: formData.isSmoking,
          isPetFriendly: formData.isPetFriendly,
          isMusic: formData.isMusic,
          femaleOnly: formData.femaleOnly,
          additionalNotes: formData.additionalNotes
        }
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      
      const res = await axios.post(
        'http://localhost:5000/api/rides',
        rideData,
        config
      );
      
      setLoading(false);
      navigate(`/rides/${res.data.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Error creating ride. Please check your information and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Create a New Ride</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">
            <h4>Route Information</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="startLocation" className="form-label">Starting Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="startLocation"
                  name="startLocation"
                  value={formData.startLocation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="endLocation" className="form-label">Destination</label>
                <input
                  type="text"
                  className="form-control"
                  id="endLocation"
                  name="endLocation"
                  value={formData.endLocation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="departureDate" className="form-label">Departure Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="departureDate"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="departureTime" className="form-label">Departure Time</label>
                <input
                  type="time"
                  className="form-control"
                  id="departureTime"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="availableSeats" className="form-label">Available Seats</label>
                <input
                  type="number"
                  className="form-control"
                  id="availableSeats"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="pricePerSeat" className="form-label">Price per Seat ($)</label>
                <input
                  type="number"
                  className="form-control"
                  id="pricePerSeat"
                  name="pricePerSeat"
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mb-4">
          <div className="card-header">
            <h4>Vehicle Information</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="vehicleModel" className="form-label">Vehicle Model</label>
                <input
                  type="text"
                  className="form-control"
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="vehicleColor" className="form-label">Vehicle Color</label>
                <input
                  type="text"
                  className="form-control"
                  id="vehicleColor"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="vehicleLicensePlate" className="form-label">License Plate</label>
                <input
                  type="text"
                  className="form-control"
                  id="vehicleLicensePlate"
                  name="vehicleLicensePlate"
                  value={formData.vehicleLicensePlate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mb-4">
          <div className="card-header">
            <h4>Preferences</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isSmoking"
                    name="isSmoking"
                    checked={formData.isSmoking}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isSmoking">
                    Smoking Allowed
                  </label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPetFriendly"
                    name="isPetFriendly"
                    checked={formData.isPetFriendly}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isPetFriendly">
                    Pet Friendly
                  </label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isMusic"
                    name="isMusic"
                    checked={formData.isMusic}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isMusic">
                    Music Allowed
                  </label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="femaleOnly"
                    name="femaleOnly"
                    checked={formData.femaleOnly}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="femaleOnly">
                    Female Only
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="additionalNotes" className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                id="additionalNotes"
                name="additionalNotes"
                rows="3"
                value={formData.additionalNotes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary me-md-2"
            onClick={() => navigate('/rides')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : 'Create Ride'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRide;