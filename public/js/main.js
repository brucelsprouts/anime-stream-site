document.addEventListener('DOMContentLoaded', async () => {
    const topAiringAnimeContainer = document.getElementById('top-airing-anime');
    
    // Fetch and display top airing anime
    const fetchTopAiringAnime = async () => {
        try {
            const response = await fetch('/top-airing');
            const topAiringAnime = await response.json();
            topAiringAnimeContainer.innerHTML = topAiringAnime
                .map(anime => `
                    <div class="anime-card">
                        <img src="${anime.image}" alt="${anime.title}">
                        <h3>${anime.title}</h3>
                        <button onclick="viewAnime('${anime.id}')">View Details</button>
                    </div>
                `)
                .join('');
        } catch (error) {
            topAiringAnimeContainer.innerHTML = '<p>Failed to load top airing anime.</p>';
        }
    };

    fetchTopAiringAnime();
    
    // Search functionality
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', () => {
        const query = document.getElementById('search-query').value;
        window.location.href = `/search-results.html?query=${encodeURIComponent(query)}`;
    });
});

// Redirect to the anime details page
function viewAnime(id) {
    window.location.href = `/anime-detail.html?id=${id}`;
}