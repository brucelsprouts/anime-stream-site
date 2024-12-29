import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/anime/gogoanime/popular")
      .then(response => setAnime(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Anime Streaming Site</h1>
      <ul>
        {anime.map(a => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
