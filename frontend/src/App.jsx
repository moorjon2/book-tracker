import { useEffect, useState } from "react";
import bookService from "./services/bookService.js";

const App = () => {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [pages, setPages] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        bookService
            .getAll()
            .then((data) => {
                setBooks(data);
            })
            .catch((error) => {
                console.error('Error fetching books:', error)
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const newBook = {
            title,
            author,
            year: Number(year),
            pages: Number(pages),
            status,
        };

        bookService
            .create(newBook)
            .then((createdBook) => {
                setBooks(books.concat(createdBook));
                // Reset form fields
                setTitle('');
                setAuthor('');
                setYear('');
                setPages('');
                setStatus('');
            })
            .catch((error) => {
                console.error('Error creating book:', error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            bookService
                .remove(id)
                .then(() => {
                    setBooks(books.filter((book) => book.id !== id));
                })
                .catch((error) => {
                    console.error('Failed to delete book: ', error)
                })
        }
    }

    return (
        <div>
            <h1>Book Tracker</h1>

            <h2>Add a New Book</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    Title: <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    Author: <input value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div>
                    Year: <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div>
                    Pages: <input type="number" value={pages} onChange={(e) => setPages(e.target.value)} />
                </div>
                <div>
                    Status:
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select</option>
                        <option value="unread">Unread</option>
                        <option value="reading">Reading</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <button type="submit">Add Book</button>
            </form>

            {books.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <ul>
                    {books.map((book) => (
                        <li key={book.id}>
                            <strong>{book.title}</strong> by {book.author} - <em>{book.status}</em>
                            <button onClick={() => handleDelete(book.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;