import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import albumRoute from './route/AlbumRoute.js'
import './grpc/index.js'
import 'reflect-metadata';
import {envConfig} from "./config/EnvConfig.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = envConfig.getPort();


app.use(cors({
    origin: false, // Không cho phép CORS vì chỉ nhận request từ API Gateway
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[Album Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});

//Routes
app.use('/api' ,albumRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({
        status: 500,
        success: false,
        message: err.message || 'Something went wrong!'
    });
    next();
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Album service is running on http://localhost:${port}/`);
});
