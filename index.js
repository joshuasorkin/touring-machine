// app.js

import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Use the CORS middleware
app.use(cors()); // This will enable CORS for all routes and origins

// Sample data for suggestions
const suggestions_default = [
    { id: 1, suggestion: "Try exploring the local market.", preferences: ["shopping", "food"] },
    { id: 2, suggestion: "Visit the art museum nearby.", preferences: ["art", "culture"] },
    { id: 3, suggestion: "Check out a popular restaurant in the area.", preferences: ["food", "dining"] },
    { id: 4, suggestion: "Take a walk in the beautiful park.", preferences: ["outdoors", "nature"] },
    { id: 5, suggestion: "Go for a scenic drive.", preferences: ["adventure", "driving"] }
];

// GET endpoint for suggestions with latitude, longitude, and preferences
app.get('/get-suggestions', async (req, res) => {
    const { latitude, longitude, preferences = [] } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    try {
        console.log('Calling location service');

        // First API call to location service with a timeout of 5 seconds
        const locationResponse = await axios.get(`https://b1b9-12-94-132-170.ngrok-free.app/location?lat=${latitude}&lon=${longitude}`, {
            timeout: 5000  // Timeout after 5 seconds
        });        
        console.log('Got response from location service');
        const location = locationResponse.data.Location;

        console.log({location});

        // Second API call to prompt.com with a POST request, sending location in the body
        const nearbyConsumablesResponse = await axios.post(
                'https://9440-34-81-214-97.ngrok-free.app/getNearbyConsumables',
                { address: location }, // Send the location as a JSON object in the body
                { timeout: 30000 } // Timeout after 5 seconds
        );

        const result = nearbyConsumablesResponse.data.result;

        // Send final response with promptData and suggestions
        res.json({
            latitude,
            longitude,
            location,
            suggestions: result
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        // Send final response with promptData and suggestions
        res.json({
            latitude,
            longitude,
            suggestions: suggestions_default
        });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
