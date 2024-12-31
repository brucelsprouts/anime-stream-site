document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const searchResultsContainer = document.getElementById('search-results');

    if (!query) {
        searchResultsContainer.innerHTML = '<p>No search query provided.</p>';
        return;
    }

    document.getElementById('search-query').value = query;

    // Fetch search results
    try {
        const response = await fetch(`/search?query=${query}`);
        const searchResults = await response.json();
        if (searchResults.length === 0) {
            searchResultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        searchResultsContainer.innerHTML = searchResults
            .map(anime => `
                <div class="anime-card">
                    <img src="${anime.image}" alt="${anime.title}">
                    <h3>${anime.title}</h3>
                    <button onclick="viewAnime('${anime.id}')">View Details</button>
                </div>
            `)
            .join('');
    } catch (error) {
        searchResultsContainer.innerHTML = '<p>Error fetching search results.</p>';
    }
});

// Redirect to the anime details page
function viewAnime(id) {
    window.location.href = `/anime-detail.html?id=${id}`;
}

// Redirect to search
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-query').value;
    window.location.href = `/pubic/search-results.html?query=${encodeURIComponent(query)}`;
});