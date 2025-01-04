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

        console.log(episodeData); // Debugging: Check the episode data response

        if (episodeData.sources && episodeData.sources.length > 0) {
            // Populate the quality dropdown
            episodeData.sources.forEach((source) => {
                if (source.isM3U8) {
                    const option = document.createElement('option');
                    option.value = source.url;
                    option.textContent = `${source.quality}`;
                    qualitySelector.appendChild(option);
                }
            });

            // Initialize HLS.js or native player
            const firstSource = episodeData.sources.find(source => source.isM3U8);
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(firstSource.url);
                hls.attachMedia(videoPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoPlayer.play();
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS.js error:', data);
                    errorMessage.textContent = 'Error playing video.';
                });

                // Listen for quality changes
                qualitySelector.addEventListener('change', (event) => {
                    const selectedUrl = event.target.value;
                    hls.loadSource(selectedUrl);
                    videoPlayer.play();
                });
            } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                videoPlayer.src = firstSource.url;
                videoPlayer.addEventListener('loadedmetadata', () => {
                    videoPlayer.play();
                });

                // Listen for quality changes
                qualitySelector.addEventListener('change', (event) => {
                    videoPlayer.src = event.target.value;
                    videoPlayer.play();
                });
            } else {
                errorMessage.textContent = 'HLS is not supported in this browser.';
            }
        } else {
            errorMessage.textContent = 'No video sources available.';
        }
    } catch (error) {
        console.error('Error fetching episode sources:', error);
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
        console.error('Error fetching anime details:', error);
        errorMessage.textContent = 'Error loading episode list.';
    }
});
