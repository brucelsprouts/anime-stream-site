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

            // Set up HLS.js to load video based on the selected quality
            if (Hls.isSupported()) {
                const hls = new Hls();
                
                // Initial load (default quality)
                hls.loadSource(episodeData.sources[0].url); // Load the first available source
                hls.attachMedia(videoPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    videoPlayer.play(); // Auto-play the video once the manifest is loaded
                });

                // Listen for quality change (when the user selects a new option)
                qualitySelector.addEventListener('change', (event) => {
                    const selectedUrl = event.target.value;
                    hls.loadSource(selectedUrl);
                    hls.attachMedia(videoPlayer);
                    videoPlayer.play();
                });
            } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari, which has native support for m3u8
                videoPlayer.src = episodeData.sources[0].url; // Load the first available source
                videoPlayer.addEventListener('loadedmetadata', () => {
                    videoPlayer.play();
                });

                // Listen for quality change (when the user selects a new option)
                qualitySelector.addEventListener('change', (event) => {
                    videoPlayer.src = event.target.value;
                    videoPlayer.play();
                });
            }
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

