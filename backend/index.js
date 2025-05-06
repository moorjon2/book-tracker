require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Book model to connect to DB
const Book = require('./models/book')

const errorHandler = require('./middleware/errorHandler')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (request, response) => {
    response.send({ status: 'ok' });
});

// Get all books
app.get('/api/books', (request, response, next) => {
    Book.find({})
        .then(books => {
            response.json(books)
        })
        .catch(error => next(error))
})

// GET single book by ID
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
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).json({ error: 'book not found'})
            }
        })
        .catch(error => next(error));
});

// DELETE book
app.delete('/api/books/:id', (request, response, next) => {
    const id = request.params.id;
    console.log('Attempting to delete book with ID:', id);

    Book.findByIdAndDelete(id)
        .then(deletedBook => {
            if (deletedBook) {
                console.log('✅ Deleted:', deletedBook);
                response.status(204).end();
            } else {
                console.log('❌ Book not found for ID:', id);
                response.status(404).json({ error: 'book not found' });
            }
        })
        .catch(error => {
            console.error('❌ Error deleting:', error);
            next(error);
        });
});

app.use(errorHandler);

// Start sever
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Book Tracker API running on port ${PORT}`);
});