import { useState, useEffect } from 'react';

const BookForm = ({ onSubmit, existingBook }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [pages, setPages] = useState('');
    const [status, setStatus] = useState('');

    // Fill in values when editing
    useEffect(() => {
        if (existingBook) {
            setTitle(existingBook.title);
            setAuthor(existingBook.author);
            setYear(existingBook.year || '');
            setPages(existingBook.pages || '');
            setStatus(existingBook.status || '');
        }
    }, [existingBook]);

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            title,
            author,
            year: year ? Number(year) : undefined,
            pages: pages ? Number(pages) : undefined,
            status,
        });

        // Reset only if it's a new book form
        if (!existingBook) {
            setTitle('');
            setAuthor('');
            setYear('');
            setPages('');
            setStatus('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{existingBook ? 'Edit Book' : 'Add Book'}</h2>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                required
            />
            <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                type="number"
                placeholder="Year"
            />
            <input
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                type="number"
                placeholder="Pages"
            />
            <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Status (e.g. reading)"
            />
            <button type="submit">{existingBook ? 'Update' : 'Add Book'}</button>
        </form>
    );
};

export default BookForm;
