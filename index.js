// app.js

import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;

// Sample data for suggestions
const suggestions = [
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
        // First API call to location.com to get location details
        const locationResponse = await axios.get(`https://aws-hack-genai-llm.fly.dev/location?lat=${latitude}&lon=${longitude}`);
        console.log('Got response from location service');
        const location = locationResponse.data.Location;

        /*
        // Second API call to prompt.com with the location data
        const promptResponse = await axios.get(`http://prompt.com/prompt?location=${encodeURIComponent(location)}`);
        const promptData = promptResponse.data;
        */

        // Filter suggestions based on user preferences (basic filtering for demonstration)
        const userPreferences = Array.isArray(preferences) ? preferences : [preferences];
        const filteredSuggestions = suggestions.filter(suggestion =>
            userPreferences.some(pref => suggestion.preferences.includes(pref))
        );

        // If no preferences match, return all suggestions
        const response = filteredSuggestions.length > 0 ? filteredSuggestions : suggestions;

        // Send final response with promptData and suggestions
        res.json({
            latitude,
            longitude,
            location,
            promptData,
            suggestions: response
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch location or prompt data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
