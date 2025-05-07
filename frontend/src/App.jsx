import { useEffect, useState } from 'react';
import bookService from './services/bookService';
import BookForm from './components/BookForm';

const App = () => {
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);

    // Load books on first render
    useEffect(() => {
        bookService.getAll().then((initialBooks) => {
            setBooks(initialBooks);
        });
    }, []);

    const handleCreate = (newBook) => {
        bookService
            .create(newBook)
            .then((createdBook) => {
                setBooks(books.concat(createdBook));
            })
            .catch((error) => {
                console.error('Error creating book:', error);
            });
    };

    const handleUpdate = (updatedBookData) => {
        bookService
            .update(editingBook.id, updatedBookData)
            .then((updatedBook) => {
                setBooks(
                    books.map((b) =>
                        b.id === updatedBook.id ? updatedBook : b
                    )
                );
                setEditingBook(null); // Exit editing mode
            })
            .catch((error) => {
                console.error('Error updating book:', error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            bookService
                .remove(id)
                .then(() => {
                    setBooks(books.filter((b) => b.id !== id));
                })
                .catch((error) => {
                    console.error('Error deleting book:', error);
                });
        }
    };

    return (
        <div>
            <h1>Book Tracker</h1>

            {/* Reuse the form for both create and edit */}
            <BookForm
                onSubmit={editingBook ? handleUpdate : handleCreate}
                existingBook={editingBook}
            />

            <h2>Books</h2>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <strong>{book.title}</strong> by {book.author}{' '}
                        {book.status && `(${book.status})`}
                        <button onClick={() => setEditingBook(book)}>Edit</button>
                        <button onClick={() => handleDelete(book.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
