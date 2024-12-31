document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const animeInfoContainer = document.getElementById('anime-info');
    const episodeListContainer = document.querySelector('#episode-list ul');

    if (!animeId) {
        animeInfoContainer.innerHTML = '<p>No anime ID provided.</p>';
        return;
    }

    // Fetch anime details
    try {
        const response = await fetch(`/anime-details?id=${animeId}`);
        const anime = await response.json();

        animeInfoContainer.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <h1>${anime.title}</h1>
            <p>${anime.description}</p>
        `;

        if (anime.episodes && anime.episodes.length > 0) {
            episodeListContainer.innerHTML = anime.episodes
                .map(episode => `
                    <li>
                        <a href="${episode.url}" target="_blank">${episode.title}</a>
                    </li>
                `)
                .join('');
        } else {
            episodeListContainer.innerHTML = '<p>No episodes available.</p>';
        }
    } catch (error) {
        animeInfoContainer.innerHTML = '<p>Error fetching anime details.</p>';
    }
});

// Redirect to search
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-query').value;
    window.location.href = `/search-results.html?query=${encodeURIComponent(query)}`;
});
