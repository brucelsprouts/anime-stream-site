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

    // Fetch episode sources
    try {
        const episodeResponse = await fetch(`/episode-sources?episodeId=${episodeId}`);
        const episodeData = await episodeResponse.json();

        console.log(episodeData); // Check the data

        if (episodeData.sources && episodeData.sources.length > 0) {
            // Populate the quality dropdown
            episodeData.sources.forEach(source => {
                if (source.isM3U8) {
                    const option = document.createElement('option');
                    option.value = source.url;
                    option.textContent = `${source.quality}`;
                    qualitySelector.appendChild(option);
                }
            });

            // Initialize Video.js player
            const player = videojs(videoPlayer, {
                techOrder: ['html5'],  // Make sure we are using HTML5 player
                sources: [{
                    src: episodeData.sources[0].url,
                    type: 'application/x-mpegURL'
                }],
                autoplay: true,
                controls: true,
                preload: 'auto'
            });

            // Listen for quality change (when the user selects a new option)
            qualitySelector.addEventListener('change', (event) => {
                const selectedUrl = event.target.value;
                player.src({ type: 'application/x-mpegURL', src: selectedUrl });
                player.play();
            });

        } else {
            errorMessage.textContent = 'No video sources available.';
        }
    } catch (error) {
        errorMessage.textContent = 'Error loading video: ' + error.message;
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
        errorMessage.textContent = 'Error loading episode list.';
    }
});
