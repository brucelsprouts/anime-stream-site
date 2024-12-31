const express = require('express');
const { gogoanime } = require('@consumet/extensions');  // Make sure the package is installed

const app = express();
const port = 3000;

// Using the Gogoanime methods directly, no need for new keyword
const gogoanime = Gogoanime;  // Assigning the imported Gogoanime object

// Serve static files (e.g., your index.html, script.js)
app.use(express.static('public'));

// Route for testing API connection
app.get('/search', async (req, res) => {
    const query = req.query.query || 'One Piece';  // Default search term

    try {
        const data = await gogoanime.search(query);  // Search for anime
        res.json(data.results);  // Send anime results to the front-end
    } catch (error) {
        console.error('Error fetching data:', error.message);  // Log the error message
        res.status(500).json({ error: 'Error fetching data from the API', details: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
