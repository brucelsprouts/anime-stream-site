const express = require('express');
const { ANIME } = require('@consumet/extensions');

const app = express();
const port = 3000;

// Gogoanime provider
const gogoanime = new ANIME.Gogoanime();

// Serve static files
app.use(express.static('public'));

// Fetch popular anime
app.get('/popular', async (req, res) => {
    try {
        const data = await gogoanime.fetchTopAiring(); // Popular anime
        res.json(data.results);
    } catch (error) {
        console.error('Error fetching popular anime:', error.message);
        res.status(500).json({ error: 'Failed to fetch popular anime' });
    }
});

// Search anime
app.get('/search', async (req, res) => {
    const query = req.query.query || '';
    try {
        const data = await gogoanime.search(query);
        res.json(data.results);
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// Fetch anime details (episodes)
app.get('/anime-details', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Anime ID is required' });

    try {
        const data = await gogoanime.fetchAnimeInfo(id);
        res.json(data);
    } catch (error) {
        console.error('Error fetching anime details:', error.message);
        res.status(500).json({ error: 'Failed to fetch anime details' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Route for fetching popular anime
app.get('/popular', async (req, res) => {
    try {
        const data = await gogoanime.fetchPopular();
        res.json(data);
    } catch (error) {
        console.error('Error fetching popular anime:', error.message);
        res.status(500).json({ error: 'Error fetching popular anime' });
    }
});