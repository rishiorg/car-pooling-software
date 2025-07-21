# Carpooling App

A smart and privacy-focused ride-sharing solution that connects riders and drivers securely. This application helps reduce travel costs, minimize traffic congestion, and decrease carbon footprints.

## Features

- User authentication and profile management
- Ride creation and management
- Intelligent ride matching based on route similarity
- Join request system for riders
- Privacy protection for users
- Responsive design for all devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React.js
- React Router
- Context API for state management
- Bootstrap for UI
- Axios for API requests

## Project Structure

```
carpooling-app/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # React components
│       │   ├── auth/       # Authentication components
│       │   ├── layout/     # Layout components
│       │   └── rides/      # Ride-related components
│       ├── context/        # React Context API
│       └── utils/          # Utility functions
└── server/                 # Backend Node.js application
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    └── routes/             # API routes
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository

2. Install server dependencies
   ```
   cd carpooling-app/server
   npm install
   ```

3. Install client dependencies
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/carpooling
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

### Running the Application

1. Start the server
   ```
   cd carpooling-app/server
   npm run dev
   ```

2. Start the client
   ```
   cd carpooling-app/client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/updateprofile` - Update user profile

### Rides
- `GET /api/rides` - Get all rides
- `GET /api/rides/:id` - Get a specific ride
- `POST /api/rides` - Create a new ride
- `PUT /api/rides/:id` - Update a ride
- `DELETE /api/rides/:id` - Delete a ride
- `GET /api/rides/user/offered` - Get rides offered by the current user
- `GET /api/rides/user/joined` - Get rides joined by the current user
- `GET /api/rides/user/pending` - Get rides with pending requests by the current user
- `POST /api/rides/:id/join` - Request to join a ride
- `POST /api/rides/:id/leave` - Leave a joined ride
- `POST /api/rides/:id/cancel` - Cancel a join request
- `POST /api/rides/:id/respond/:userId` - Respond to a join request
- `GET /api/rides/:id/match` - Calculate route match percentage

## License

This project is licensed under the MIT License.