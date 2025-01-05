const express = require('express');
const request = require('request'); // Import the 'request' package
const { ANIME } = require('@consumet/extensions');

const app = express();

// Use the PORT environment variable or default to 3000
const port = process.env.PORT || 3000;

// Gogoanime provider
const gogoanime = new ANIME.Gogoanime();

// Serve static files
app.use(express.static('public'));

// Proxy route for m3u8 files
app.get('/proxy', (req, res) => {
    const url = req.query.url; // URL of the .m3u8 file to be proxied
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Fetch the m3u8 file from the external source and pipe it through
    request(url)
        .on('error', (error) => {
            console.error('Error fetching the URL:', error);
            res.status(500).json({ error: 'Failed to fetch the m3u8 file' });
        })
        .pipe(res);
});

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

// Fetch episode sources
app.get('/episode-sources', async (req, res) => {
    const episodeId = req.query.episodeId;
    if (!episodeId) return res.status(400).json({ error: 'Episode ID is required' });

    try {
        const data = await gogoanime.fetchEpisodeSources(episodeId);
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
