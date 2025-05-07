import axios from 'axios';

const baseURL = 'http://localhost:3000/api/books';

// GET all books
const getAll = () => {
    return axios.get(baseURL).then(response => response.data);
};

// POST a new book
const create = (newBook) => {
    return axios.post(baseURL, newBook).then(response => response.data);
};

// UPDATE a book
const update = (id, updatedBook) => {
    return axios.put(`${baseURL}/${id}`, updatedBook).then(response => response.data);
};

// DELETE a book
const remove = (id) => {
    return axios.delete(`${baseURL}/${id}`);
};

export default {
    getAll,
    create,
    update,
    remove,
};