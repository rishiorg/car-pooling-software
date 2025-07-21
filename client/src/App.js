import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Ride Components
import Home from './components/rides/Home';
import RideList from './components/rides/RideList';
import RideDetail from './components/rides/RideDetail';
import CreateRide from './components/rides/CreateRide';
import MyRides from './components/rides/MyRides';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="container py-4 flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/rides" element={<RideList />} />
                <Route path="/rides/:id" element={<RideDetail />} />
                <Route path="/create-ride" element={
                  <PrivateRoute>
                    <CreateRide />
                  </PrivateRoute>
                } />
                <Route path="/my-rides" element={
                  <PrivateRoute>
                    <MyRides />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;