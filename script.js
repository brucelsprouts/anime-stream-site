// Fetch and display anime based on search
async function searchAnime(query) {
    const animeList = document.getElementById("anime-list");
    animeList.innerHTML = "Loading...";
  
    try {
      const response = await fetch(`https://api.consumet.org/meta/anilist/${encodeURIComponent(query)}`);
      const data = await response.json();
  
      // Log the response to check the structure of the data
      console.log(data);
  
      if (data.results && data.results.length > 0) {
        animeList.innerHTML = "";
        data.results.forEach(anime => {
          const animeItem = document.createElement("div");
          animeItem.className = "anime-item";
          animeItem.textContent = anime.title.romaji || anime.title.english;
          animeItem.onclick = () => loadAnimeDetails(anime.id, anime.title.romaji);
          animeList.appendChild(animeItem);
        });
      } else {
        animeList.innerHTML = "No results found.";
      }
    } catch (error) {
      animeList.innerHTML = "Error fetching data.";
      console.error("Error fetching data:", error);
    }
  }
  
  
  // Load anime details (episodes and video player)
  async function loadAnimeDetails(id, title) {
    const player = document.getElementById("player");
    const animeTitle = document.getElementById("anime-title");
    const episodesList = document.getElementById("episodes");
    const videoPlayer = document.getElementById("video-player");
  
    player.style.display = "block";
    animeTitle.textContent = title;
    episodesList.innerHTML = "Loading episodes...";
    videoPlayer.src = ""; // Reset video
  
    try {
      const response = await fetch(`https://api.consumet.org/meta/anilist/info/${id}`);
      const data = await response.json();
  
      // Show episodes
      episodesList.innerHTML = "";
      data.episodes.forEach(episode => {
        const episodeItem = document.createElement("li");
        episodeItem.textContent = `Episode ${episode.number}`;
        episodeItem.onclick = () => {
          videoPlayer.src = episode.url;
          videoPlayer.play();
        };
        episodesList.appendChild(episodeItem);
      });
    } catch (error) {
      episodesList.innerHTML = "Error loading episodes.";
    }
  }
  
  // Attach search functionality
  document.getElementById("search-button").onclick = () => {
    const query = document.getElementById("search-bar").value;
    if (query.trim() !== "") searchAnime(query);
  };
  