import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import officialArtistRouter from './route/OfficialArtistRoute.js'
import 'reflect-metadata';


const app = express();
const port = process.env.PORT || 3002; 

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.match(/^https?:\/\/(localhost|tunez-ddb5f\.firebaseapp\.com|api-gateway)(:\d+)?$/)) {
            callback(null, true); // Cho phép Mobile App, Web App hợp lệ và API Gateway
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log(`[Official Artist Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});

// Routes
app.use(officialArtistRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`User service is running on http://localhost:${port}/`);
});