const express = require('express');
const axios = require('axios'); // Replaced request with axios
const cors = require('cors'); // Added CORS support
const { ANIME } = require('@consumet/extensions');

const app = express();

// Use the PORT environment variable or default to 3000
const port = process.env.PORT || 3000;

// Zoro provider
const zoro = new ANIME.Zoro(); // Replacing Gogoanime with Zoro

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Proxy route for m3u8 files
app.get('/proxy', async (req, res) => {
    const url = req.query.url; // URL of the .m3u8 file to be proxied
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const response = await axios.get(url, { responseType: 'stream' });
        response.data.pipe(res); // Pipe the response stream to the client
    } catch (error) {
        console.error('Error fetching the URL:', error);
        res.status(500).json({ error: 'Failed to fetch the m3u8 file' });
    }
});

// Fetch top airing anime
app.get('/top-airing', async (req, res) => {
    try {
        const data = await zoro.fetchTopAiring(); // Using Zoro for top airing anime
        res.json(data.results);
    } catch (error) {
        console.error('Error fetching top airing anime:', error.message);
        res.status(500).json({ error: 'Failed to fetch top airing anime' });
    }
});

// Search anime
app.get('/search', async (req, res) => {
    const query = req.query.query || '';
    try {
        const data = await zoro.search(query); // Using Zoro for search
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
        const data = await zoro.fetchAnimeInfo(id); // Using Zoro for anime details
        res.json(data);
    } catch (error) {
        console.error('Error fetching anime details:', error.message);
        res.status(500).json({ error: 'Failed to fetch anime details' });
    }
});

// Fetch episode sources
app.get('/episode-sources', async (req, res) => {
    const episodeId = req.query.episodeId;
    if (!episodeId) return res.status(400).json({ error: 'Episode ID is required' });

    try {
        const data = await zoro.fetchEpisodeSources(episodeId); // Using Zoro for episode sources
        res.json(data);
    } catch (error) {
        console.error('Error fetching episode sources:', error.message);
        res.status(500).json({ error: 'Failed to fetch episode sources' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
