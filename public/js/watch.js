document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const episodeId = params.get('episode');
    const episodeListContainer = document.querySelector('#episode-list ul');
    const errorMessage = document.getElementById('error-message');
    const qualitySelector = document.getElementById('quality');
    const videoPlayer = document.getElementById('video-player');

    if (!animeId || !episodeId) {
        errorMessage.textContent = 'Invalid URL. Anime or episode ID is missing.';
        return;
    }

    try {
        // Fetch episode sources
        const episodeSourcesResponse = await fetch(`/episode-sources?episodeId=${episodeId}`);
        const episodeSources = await episodeSourcesResponse.json();

        if (episodeSources.error) {
            throw new Error(episodeSources.error);
        }

        // Populate quality selector dynamically
        episodeSources.sources.forEach(source => {
            const option = document.createElement('option');
            option.value = source.url;
            option.textContent = `${source.quality} - ${source.isM3U8 ? 'HLS' : 'MP4'}`;
            qualitySelector.appendChild(option);
        });

        // Initialize Video.js player
        const player = videojs(videoPlayer, {
            controls: true,
            autoplay: true,
            preload: 'auto',
            techOrder: ['html5', 'flash'],
        });

        // Set default video source (HLS or MP4 based on the first source)
        if (episodeSources.sources.length > 0) {
            const defaultSource = episodeSources.sources[0];
            player.src({
                type: defaultSource.isM3U8 ? 'application/x-mpegURL' : 'video/mp4',
                src: defaultSource.url
            });
        }

        // Listen for quality selection change
        qualitySelector.addEventListener('change', (event) => {
            const selectedSource = event.target.value;
            player.src({ type: 'application/x-mpegURL', src: selectedSource });
            player.play();
        });

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
