import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Carpooling App</h5>
            <p className="mb-0">
              A smart and privacy-focused ride-sharing solution.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">&copy; {new Date().getFullYear()} Carpooling App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;