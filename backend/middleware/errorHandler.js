const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted ID' });
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error); // Pass to any other error middleware (optional)
};

module.exports = errorHandler;