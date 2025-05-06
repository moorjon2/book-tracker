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

// GET single book by ID
app.get('/api/books/:id', (request, response, next) => {
    Book.findById(request.params.id)
        .then(book => {
            if (book) {
                response.json(book);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

// POST new book
app.post('/api/books', (request, response, next) => {
    const { title, author, year, pages, status } = request.body;

    const book = new Book({
        title,
        author,
        year,
        pages,
        status,
    });

    book.save()
        .then(savedBook => response.status(201).json(savedBook))
        .catch(error => (error));
});

// PUT update book
app.put('/api/books/:id', (request, response, next) => {
    const { title, author, year, pages, status } = request.body;

    const updatedBook = { title, author, year, pages, status };

    Book.findByIdAndUpdate(request.params.id, updatedBook, {
        new: true,
        runValidators: true,
        context: 'query',
    })
        .then(result => response.json(result))
        .catch(error => next(error));
});

// DELETE book
app.delete('/api/book/:id', (request, response, next) => {
    Book.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error));
});

// Start sever
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Book Tracker API running on port ${PORT}`);
});