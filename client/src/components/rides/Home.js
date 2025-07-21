import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="jumbotron bg-light p-5 rounded-3 mb-4">
        <div className="container">
          <h1 className="display-4">Welcome to Carpooling App</h1>
          <p className="lead">
            A smart and privacy-focused ride-sharing solution that connects riders and drivers securely.
          </p>
          <hr className="my-4" />
          <p>
            Join our community to reduce travel costs, minimize traffic congestion, and decrease carbon footprints.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg me-2">
            Sign Up Now
          </Link>
          <Link to="/rides" className="btn btn-outline-primary btn-lg">
            Find a Ride
          </Link>
        </div>
      </div>

      <div className="container">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h3 className="card-title">1. Pool Creation & Joining</h3>
                <p className="card-text">
                  Drivers can create ride pools by specifying pickup/drop locations, departure time, and preferences.
                  Riders can search for available rides based on their needs.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h3 className="card-title">2. Intelligent Ride Matching</h3>
                <p className="card-text">
                  Our system automatically matches riders with available carpools based on proximity, route similarity,
                  timing, and user preferences.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h3 className="card-title">3. Privacy Protection</h3>
                <p className="card-text">
                  Your privacy is our priority. We mask personal information, provide in-app communication, and include
                  emergency features for your safety.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/register" className="btn btn-success btn-lg">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;