require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cookieParser = require('cookie-parser');

const cors = require('cors');
const passport = require('passport');

const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const contactRoutes = require('./routes/contact');
const listRoutes = require('./routes/list');
require('./config/passport');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    preflightContinue: false,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
app.use(session({
        store: new pgSession({ pool }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        }
    }));

// Init passport
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/list', listRoutes);


// Global logging for debug
app.use((req, res, next) => {
    console.log('Middleware - Incoming request:', req.method, req.url);
    console.log('Middleware - Session:', req.session);
    console.log('Middleware - Cookies recieved:', req.cookies);
    console.log('Middleware - Headers', res.headers)
    console.log('Middleware - User: ', req.user);
    next();
});


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
