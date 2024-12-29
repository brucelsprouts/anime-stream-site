// ESM
import { ANIME } from "@consumet/extensions"
// CommonJS
const { ANIME } = require("@consumet/extensions");

const main = async () => {
  // Create a new instance of the Gogoanime provider
  const gogoanime = new ANIME.Gogoanime();
  // Search for a anime. In this case, "One Piece"
  const results = await gogoanime.search("One Piece");
  // Print the results
  console.log(results);
  // Get the first anime info
  const firstAnime = results.results[0];
  const animeInfo = await gogoanime.fetchAnimeInfo(firstAnime.id);
  // Print the info
  console.log(animeInfo);
  // get the first episode stream link. By default, it chooses goload server.
  const episodes = await gogoanime.fetchEpisodeSources(animeInfo.episodes[0].id);
  // get the available streaming servers for the first episode
  const streamingServers = await gogoanime.fetchEpisodeServers(animeInfo.episodes[0].id);
}