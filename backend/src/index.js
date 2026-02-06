const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const { getPublicEvent, getPublicEvents } = require('./controllers/eventsController');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// Public events (no auth) — register BEFORE the auth-protected router
app.get('/api/events/public', getPublicEvents);           // List all public events
app.get('/api/events/public/:publicId', getPublicEvent);  // Get single public event by ID

// Routes
app.use('/api/auth', authRoutes);

// Auth-protected events routes (for create, update, private events, etc.)
app.use('/api/events', eventsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
