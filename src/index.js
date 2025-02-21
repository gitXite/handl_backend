require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
require('./config/passport');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedMethods: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            path: '/',
            domain: 'localhost',
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        }
    }));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Global logging for debug
app.use((req, res, next) => {
    console.log('Middleware - Incoming request:', req.method, req.url);
    console.log('Middleware - Session:', req.session);
    console.log('Middleware - Cookies recieved:', req.cookies);
    console.log('Middleware - User: ', req.user);
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Start server logic
async function startServer() {
    try {
        await pool.query('SELECT 1');
        console.log('Database connected successfully.');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);
    }
}


startServer();
