document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const episodeId = params.get('episode');
    const videoPlayer = document.getElementById('video-player');
    const episodeListContainer = document.querySelector('#episode-list ul');
    const errorMessage = document.getElementById('error-message');

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
            // Check if HLS sources are available (m3u8)
            const hlsSource = episodeData.sources.find(source => source.isM3U8);
            if (hlsSource) {
                // Use HLS.js to play .m3u8 stream
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(hlsSource.url);
                    hls.attachMedia(videoPlayer);
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        videoPlayer.play(); // Auto-play the video once the manifest is loaded
                    });
                } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                    // For Safari, which has native support for m3u8
                    videoPlayer.src = hlsSource.url;
                    videoPlayer.addEventListener('loadedmetadata', () => {
                        videoPlayer.play();
                    });
                } else {
                    errorMessage.textContent = 'Your browser does not support HLS streaming.';
                }
            } else {
                errorMessage.textContent = 'No valid video source found.';
            }
        } else {
            errorMessage.textContent = 'No video sources available.';
        }
    } catch (error) {
        console.error('Error loading episode sources:', error);
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
        console.error('Error loading anime details:', error);
        errorMessage.textContent = 'Error loading episode list.';
    }
});
