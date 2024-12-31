const express = require('express');
const { ANIME } = require('@consumet/extensions'); // Correct import for ANIME

const app = express();
const port = 3000;

// Initialize the Gogoanime provider
const gogoanime = new ANIME.Gogoanime();

// Serve static files (ensure the "public" folder exists and contains your front-end files)
app.use(express.static('public'));

// Route for searching anime
app.get('/search', async (req, res) => {
    const query = req.query.query || 'One Piece'; // Default search term if none is provided

    try {
        const data = await gogoanime.search(query); // Search for anime
        res.json(data.results); // Return search results to the client
    } catch (error) {
        console.error('Error fetching data:', error.message); // Log the error
        res.status(500).json({ error: 'Error fetching data from Gogoanime API', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
