require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Book model to connect to DB
const Book = require('./models/book')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (request, response) => {
    response.send({ status: 'ok' });
});

// Start sever
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Book Tracker API running on port ${PORT}`);
});