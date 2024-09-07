// app.js

import express from 'express';

const app = express();
const PORT = 3000;

// Sample data for suggestions
const suggestions = [
    { id: 1, suggestion: "Try exploring the local market." },
    { id: 2, suggestion: "Visit the art museum nearby." },
    { id: 3, suggestion: "Check out a popular restaurant in the area." }
];

// GET endpoint for suggestions
app.get('/get-suggestions', (req, res) => {
    res.json(suggestions);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
