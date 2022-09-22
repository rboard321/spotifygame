import React, { useEffect, useState } from "react";

import fetchFromSpotify from "../services/api";
import { useNavigate } from "react-router-dom";
import Showsong from "./Showsong";
import { Howl, Howler } from "howler";
import ShowArtists from "./ShowArtists";

import { Button, Grid, Typography, CircularProgress, Alert, AlertTitle } from "@mui/material";


const Game = ({
  gameInfo,
  setResult,
  setError,
  setScore,
  score,
  lives,
  setLives
}) => {

  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [songOptions, setSongOptions] = useState();
  const [correctArtist, setCorrectArtist] = useState();

  const [songs, setSongs] = useState();
    let songsArray = [];
console.log("songs options >>>",songOptions)
  //handle playing preview

  const { Howl, Howler } = require("howler");
  
  const selectSong = indx => {
    
    if (indx == 0) {
      stopSongs()
      songs[0].play();
    }
    if (indx == 1) {
      stopSongs()
      songs[1].play();
    }
    if (indx == 2) {
      stopSongs()
      songs[2].play();
    }
  };

  const [correct, setCorrect] = useState("");


  const stopSongs = () => {
    songs.forEach(element => {
      element.stop()
    })
  };

  const checkCorrect = (result) => {
    setCorrect(result);
    setTimeout(() => {
      setCorrect("");
    }, 3000)
  }

  //handle error when not enough artist in genre
  const checkArtists = artistArray => {
    if (artistArray.length < gameInfo.numArtist) {
      setError({
        condition: true,
        type: "artists",
      });
      navigate("/");
    }
    return;
  };

  //get new artists and tracks when not enough preview songs
  const checkSongs = async songArray => {
    if (songArray.length < gameInfo.numTrack || songArray[0] === null) {
      const artistsToSet = await getArtists(gameInfo.token);
      checkArtists(artistsToSet);
      setCorrectArtist(artistsToSet[1].id);
      const tracks = await getTracks(gameInfo.token, artistsToSet[1]);
      tracks.map(track => {
        let currenntUrl = track.preview_url;
        if (songsArray.length < gameInfo.numTrack) {
          if (currenntUrl != null) {
            songsArray.push(currenntUrl);
          }
        }
      });
      checkSongs(songArray);
    }
    setSongOptions(songsArray);
  };

  //get random offset
  const getRandomOffset = () => {
    return Math.floor(Math.random() * 100);
  };
  //get random artist for correct answer
  const getRandomArtist = () => {
    return Math.floor(Math.random() * gameInfo.numArtist);
  };

  //get artists from genre
  const getArtists = async t => {
    const offset = getRandomOffset();
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "search",
      params: {
        q: `genre:${gameInfo.genre}`,
        type: "artist",
        limit: `${gameInfo.numArtist}`,
        offset: offset,
      },
    });
    setArtists(response.artists.items);
    return response.artists.items;
  };

  //get tracks from artist
  const getTracks = async (t, artistToGet) => {
    const response = await fetchFromSpotify({
      token: t,
      endpoint: `artists/${artistToGet.id}/top-tracks`,
      params: {
        country: "us",
      },
    });
    setTracks(response.tracks);
    return response.tracks;
  };


  const howlerSong = () => {
    if(songOptions){
    let songsList = songOptions.map(song => new Howl({src:[song],
      html5: true,
      volume: 0.5,}))
      console.log("songsList", songsList)
      setSongs(songsList)
    }
  }


  //fetching game currect data and config

  async function fetchGameData() {
    const artistIdx = getRandomArtist();
    const artistsToSet = await getArtists(gameInfo.token);
    checkArtists(artistsToSet);
    setCorrectArtist(artistsToSet[artistIdx].id);
    const tracks = await getTracks(gameInfo.token, artistsToSet[artistIdx]);
    tracks.map((track) => {
      let currenntUrl = track.preview_url;
      if (songsArray.length < gameInfo.numTrack) {
        if (currenntUrl != null) {
          songsArray.push(currenntUrl);
        }
      }
    });
    checkSongs(songsArray);
    stopSongs()
  }
  useEffect(() => {
    fetchGameData();
  }, []);
  
  useEffect(() => {
    howlerSong();
  }, [songOptions]);

  
  //styling
  const centering = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px",
  };
  const textContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px",
  };
  const centeringBlock = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px",
  };

  return songOptions ? (
    <div>
      <Grid container style={centering}>
        <Grid item xs={12} style={centeringBlock}>
          <Typography variant="h2" >Guess The Artist</Typography>
          <Typography variant="body1" sx={{ fontStyle: "italic"}}>
            Play the sample(s) and select the correct artist.
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: "italic"}}>
            Winner scores a 100!
            </Typography>
        </Grid>

        <Grid item xs={12} style={textContainer}>
          <Typography variant="h5">
            Score: &nbsp;
          </Typography>
          <Typography variant="h5" color="primary">{score} &nbsp;</Typography> 
          <Typography variant="h5">
             Lives: &nbsp;
          </Typography>
          <Typography variant="h5" color="error">{lives} &nbsp;</Typography> 
        </Grid>

        <Grid item xs={12} style={textContainer}>
          {correct === "right" && 
            <Alert severity="success">
              Congrats! You got it right! <strong> + 10 points</strong>
            </Alert>
          }
          {correct === "wrong" && 
            <Alert severity="warning">
              Sorry! You got it wrong!<strong> You lost a life.</strong>
            </Alert>
          }
        </Grid>

        <Grid item direction="column" xs={6} style={centering}>
          <Showsong artist={artists} tracks={tracks} songOptions={songOptions} selectSong={selectSong} stopSongs={stopSongs}/>
          <ShowArtists
            artists={artists}
            setResult={setResult}
            correctArtist={correctArtist}
            score={score}
            setScore={setScore}
            lives={lives}
            setLives={setLives}
            fetchGameData={fetchGameData}

            stopSongs={stopSongs}

            checkCorrect={checkCorrect}

          />
        </Grid>
      </Grid>
    </div>
  ) : (
    <CircularProgress />
  );
};

export default Game;
