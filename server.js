const express = require('express');
const { ANIME } = require('@consumet/extensions');

const app = express();
const port = 3000;

// Instance of Gogoanime
const gogoanime = new ANIME.Gogoanime();

// Search for an anime
app.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    try {
        const results = await gogoanime.search(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch anime details
app.get('/anime/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const animeInfo = await gogoanime.fetchAnimeInfo(id);
        res.json(animeInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch episode sources
app.get('/episode/:id', async (req, res) => {
    const episodeId = req.params.id;
    try {
        const episodeSources = await gogoanime.fetchEpisodeSources(episodeId);
        res.json(episodeSources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});