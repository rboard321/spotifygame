import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Game from "./Game";
import Result from "./Result";

const App = () => {
  const localStorageState = {
    token: localStorage.token,
    genre: localStorage.genre,
    numArtist: localStorage.numArtist,
    numTrack: localStorage.numTrack,
  };

  const [gameInfo, setGameInfo] = useState(localStorageState);
  const [result, setResult] = useState(false);
  const [error, setError] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  

  const genresArr = [
    "alternative",
    "children",
    "classical",
    "country",
    "dance",
    "disco",
    "edm",
    "folk",
    "heavy-metal",
    "hip-hop",
    "holiday",
    "house",
    "jazz",
    "pop",
    "punk-rock",
    "reggae",
    "rock",
    "rock-n-roll",
  ];

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              setGameInfo={setGameInfo}
              error={error}
              genresArr={genresArr}
            />
          }
        />
        <Route
          path="/game"
          element={
            <Game
              gameInfo={gameInfo}
              setResult={setResult}
              setError={setError}
              score={score}
              setScore={setScore}
              lives={lives}
              setLives={setLives}
              setGameInfo={setGameInfo}
              
            />
          }
        />
        <Route
          path="/result"
          element={<Result result={result} score={score} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
