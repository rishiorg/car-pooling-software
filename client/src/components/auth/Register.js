import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    preferences: {
      isSmoking: false,
      isPetFriendly: false,
      isMusic: true,
      femaleOnly: false
    }
  });
  const [formError, setFormError] = useState('');

  const { register, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const { name, email, password, confirmPassword, phoneNumber, preferences } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onPreferenceChange = (e) => {
    setFormData({
      ...formData,
      preferences: {
        ...preferences,
        [e.target.name]: e.target.checked
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        phoneNumber,
        preferences
      });
      navigate('/');
    } catch (err) {
      setFormError(error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Register</h2>
            {formError && (
              <div className="alert alert-danger" role="alert">
                {formError}
              </div>
            )}
            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Enter your password"
                    minLength="6"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    placeholder="Confirm your password"
                    minLength="6"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={onChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Preferences</label>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isSmoking"
                        name="isSmoking"
                        checked={preferences.isSmoking}
                        onChange={onPreferenceChange}
                      />
                      <label className="form-check-label" htmlFor="isSmoking">
                        Smoking Allowed
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPetFriendly"
                        name="isPetFriendly"
                        checked={preferences.isPetFriendly}
                        onChange={onPreferenceChange}
                      />
                      <label className="form-check-label" htmlFor="isPetFriendly">
                        Pet Friendly
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isMusic"
                        name="isMusic"
                        checked={preferences.isMusic}
                        onChange={onPreferenceChange}
                      />
                      <label className="form-check-label" htmlFor="isMusic">
                        Music Allowed
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="femaleOnly"
                        name="femaleOnly"
                        checked={preferences.femaleOnly}
                        onChange={onPreferenceChange}
                      />
                      <label className="form-check-label" htmlFor="femaleOnly">
                        Female Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                Register
              </button>
            </form>
            <div className="mt-3 text-center">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;