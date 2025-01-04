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

        if (episodeData.sources && episodeData.sources.length > 0) {
            // Use the first available source (MP4)
            const highestQuality = episodeData.sources[0];

            // Directly set the video source (no HLS.js needed for MP4)
            videoPlayer.src = highestQuality.url;
            videoPlayer.addEventListener('loadedmetadata', () => {
                videoPlayer.play();
            });
        } else {
            errorMessage.textContent = 'No video sources available.';
        }
    } catch (error) {
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
        errorMessage.textContent = 'Error loading episode list.';
    }
});
