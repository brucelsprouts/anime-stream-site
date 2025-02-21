document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const episodeId = params.get('episode');
    const videoPlayer = document.getElementById('video-player');
    const episodeListContainer = document.querySelector('#episode-list ul');
    const errorMessage = document.getElementById('error-message');
    const qualitySelector = document.getElementById('quality');

    if (!animeId || !episodeId) {
        errorMessage.textContent = 'Invalid URL. Anime or episode ID is missing.';
        return;
    }

    try {
        // Fetch episode sources using zoro API
        const episodeData = await zoro.fetchEpisodeSources(episodeId);
        console.log(episodeData); // Debugging: Log the episode data

        if (episodeData.sources && episodeData.sources.length > 0) {
            // Populate the quality dropdown
            episodeData.sources.forEach(source => {
                if (source.isM3U8) {
                    const option = document.createElement('option');
                    option.value = source.url;
                    option.textContent = source.quality;
                    qualitySelector.appendChild(option);
                }
            });

            // Default to the first available source
            const selectedUrl = episodeData.sources[0].url;
            const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(selectedUrl)}`;

            // Initialize Video.js player
            const player = videojs(videoPlayer, {
                techOrder: ['html5'],
                sources: [{ src: proxyUrl, type: 'application/x-mpegURL' }],
                autoplay: true,
                controls: true,
                preload: 'auto'
            });

            // Handle quality change
            qualitySelector.addEventListener('change', (event) => {
                const newUrl = event.target.value;
                const proxyNewUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(newUrl)}`;
                player.src({ type: 'application/x-mpegURL', src: proxyNewUrl });
                player.play();
            });

        } else {
            errorMessage.textContent = 'No video sources available.';
        }
    } catch (error) {
        errorMessage.textContent = 'Error fetching episode sources: ' + error.message;
    }

    // Fetch anime details for episode list
    try {
        const animeResponse = await fetch(`/anime-details?id=${animeId}`);
        const anime = await animeResponse.json();

        episodeListContainer.innerHTML = anime.episodes
            .map(episode => `
                <li>
                    <a href="/watch.html?id=${animeId}&episode=${episode.id}">Episode ${episode.number}</a>
                </li>
            `)
            .join('');
    } catch (error) {
        errorMessage.textContent = 'Error loading episode list: ' + error.message;
    }
});
