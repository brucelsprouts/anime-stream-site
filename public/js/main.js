document.addEventListener('DOMContentLoaded', async () => {
    const popularAnimeContainer = document.getElementById('popular-anime');
    
    // Fetch and display popular anime
    const fetchPopularAnime = async () => {
        try {
            const response = await fetch('/popular');
            const popularAnime = await response.json();
            popularAnimeContainer.innerHTML = popularAnime
                .map(anime => `
                    <div class="anime-card">
                        <img src="${anime.image}" alt="${anime.title}">
                        <h3>${anime.title}</h3>
                        <button onclick="viewAnime('${anime.id}')">View Details</button>
                    </div>
                `)
                .join('');
        } catch (error) {
            popularAnimeContainer.innerHTML = '<p>Failed to load popular anime.</p>';
        }
    };

    fetchPopularAnime();

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