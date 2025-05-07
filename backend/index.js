require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Book = require('./models/book');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --- MongoDB connection ---
mongoose.set('strictQuery', false);
const mongoUrl = process.env.MONGODB_URI;

console.log('Connecting to MongoDB...');
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
    });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Serve frontend ---
app.use(express.static('dist'));

// --- API Routes ---

// Health check
app.get('/api/health', (request, response) => {
    response.send({ status: 'ok' });
});

// Get all books
app.get('/api/books', (request, response, next) => {
    Book.find({})
        .then(books => response.json(books))
        .catch(error => next(error));
});

// Get single book
app.get('/api/books/:id', (request, response, next) => {
    Book.findById(request.params.id)
        .then(book => {
            if (book) {
                response.json(book);
            } else {
                response.status(404).send({ error: 'book not found' });
            }
        })
        .catch(error => next(error));
});

// Create a new book
app.post('/api/books', (request, response, next) => {
    const { title, author, year, pages, status } = request.body;

    const book = new Book({ title, author, year, pages, status });

    book.save()
        .then(savedBook => response.status(201).json(savedBook))
        .catch(error => next(error)); // ⬅️ fixed this too
});

// Update a book
app.put('/api/books/:id', (request, response, next) => {
    const { title, author, year, pages, status } = request.body;
    const updatedBook = { title, author, year, pages, status };

    Book.findByIdAndUpdate(request.params.id, updatedBook, {
        new: true,
        runValidators: true,
        context: 'query',
    })
        .then(result => {
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: 'book not found' });
            }
        })
        .catch(error => next(error));
});

// Delete a book
app.delete('/api/books/:id', (request, response, next) => {
    Book.findByIdAndDelete(request.params.id)
        .then(deletedBook => {
            if (deletedBook) {
                response.status(204).end();
            } else {
                response.status(404).json({ error: 'book not found' });
            }
        })
        .catch(error => next(error));
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`📚 Book Tracker API running on port ${PORT}`);
});
