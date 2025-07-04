require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL, // For production (your Vercel URL)
  'http://localhost:5173',  // Default Vite port
  'http://localhost:8080',  // The port from your error log
  'http://localhost:3000',  // Another common dev port
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // and requests from whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Create downloads folder if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// API routes
app.use('/api', videoRoutes);

// Static route to serve downloaded files
app.use('/videos', express.static(downloadsDir));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 