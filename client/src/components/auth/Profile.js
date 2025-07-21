import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: {
      isSmoking: false,
      isPetFriendly: false,
      isMusic: false,
      femaleOnly: false
    },
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [passwordMode, setPasswordMode] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        preferences: {
          isSmoking: user.preferences?.isSmoking || false,
          isPetFriendly: user.preferences?.isPetFriendly || false,
          isMusic: user.preferences?.isMusic || false,
          femaleOnly: user.preferences?.femaleOnly || false
        },
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefName = name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [prefName]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        preferences: formData.preferences
      };
      
      // Add password fields if in password mode
      if (passwordMode) {
        if (formData.newPassword !== formData.confirmNewPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        
        if (formData.newPassword.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      await updateProfile(updateData);
      
      setMessage('Profile updated successfully');
      
      // Reset password fields
      if (passwordMode) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setPasswordMode(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Error updating profile. Please try again.'
      );
    }
    
    setLoading(false);
  };

  if (authLoading) {
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
      <h2 className="mb-4">My Profile</h2>
      
      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{passwordMode ? 'Change Password' : 'Profile Information'}</h4>
          <button 
            type="button" 
            className="btn btn-outline-primary"
            onClick={() => setPasswordMode(!passwordMode)}
          >
            {passwordMode ? 'Edit Profile' : 'Change Password'}
          </button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {!passwordMode ? (
              // Profile Information Form
              <>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    disabled
                  />
                  <div className="form-text">Email cannot be changed.</div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <h5 className="mt-4 mb-3">Ride Preferences</h5>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isSmoking"
                        name="preferences.isSmoking"
                        checked={formData.preferences.isSmoking}
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
                        name="preferences.isPetFriendly"
                        checked={formData.preferences.isPetFriendly}
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
                        name="preferences.isMusic"
                        checked={formData.preferences.isMusic}
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
                        name="preferences.femaleOnly"
                        checked={formData.preferences.femaleOnly}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="femaleOnly">
                        Female Only
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Change Password Form
              <>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
              </>
            )}
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;