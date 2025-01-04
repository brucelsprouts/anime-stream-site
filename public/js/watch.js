document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const episodeId = params.get('episode');
    const videoPlayer = document.getElementById('video-player');
    const videoSource = document.getElementById('video-source');
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

        console.log('Episode Data:', episodeData); // Debugging

        if (episodeData.sources && episodeData.sources.length > 0) {
            const highestQuality = episodeData.sources.find(source => source.quality === '1080p') || episodeData.sources[0];
            console.log('Selected Source:', highestQuality); // Debugging

            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(highestQuality.url);
                hls.attachMedia(videoPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('HLS manifest parsed, starting playback');
                    videoPlayer.play();
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS error:', data);
                    errorMessage.textContent = `Error loading video: ${data.type} - ${data.details}`;
                    if (data.response && data.response.code) {
                        console.error('HTTP response code:', data.response.code);
                    }
                    if (data.response && data.response.text) {
                        console.error('HTTP response text:', data.response.text);
                    }
                });
            } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                videoPlayer.src = highestQuality.url;
                videoPlayer.addEventListener('loadedmetadata', () => {
                    console.log('Metadata loaded, starting playback');
                    videoPlayer.play();
                });
            } else {
                errorMessage.textContent = 'Your browser does not support HLS.';
            }
        } else {
            errorMessage.textContent = 'No video sources available.';
        }
    } catch (error) {
        console.error('Error loading video:', error);
        errorMessage.textContent = 'Error loading video.';
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
        console.error('Error loading episode list:', error);
        errorMessage.textContent = 'Error loading episode list.';
    }
});