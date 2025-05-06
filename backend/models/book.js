const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to MongoDB...');
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    status: {
        type: String,
        enum: ['unread', 'reading', 'read'],
        default: 'unread',
    },
});

bookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('Book', bookSchema)