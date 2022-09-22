import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchFromSpotify, { request } from "../services/api";
import {
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress
} from "@mui/material";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const Home = ({ setGameInfo, error, genresArr}) => {
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState("");

  

  //Default set useState from Config Form
  const [numArtist, setNumArtist] = useState(2);
  const [numTrack, setNumTrack] = useState(1);

  //making sure user select a genre
  const handleValidation = () => {
    if (selectedGenre) {
      return true;
    }
    alert("Genre was not selected");
    return false;
  };

  //handle submit - set all variables and navigate to Game
  const handleSubmit = () => {
    if (handleValidation() === true) {
      localStorage.setItem("token", token);
      localStorage.setItem("genre", selectedGenre);
      localStorage.setItem("numArtist", numArtist);
      localStorage.setItem("numTrack", numTrack);
      setGameInfo({
        token: token,
        genre: selectedGenre,
        numArtist: numArtist,
        numTrack: numTrack,
      });
      navigate("/game");
    }
  };

  //get all genres during loading
  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    const filteredGenres = genresArr.filter(function (genre) {
      return response.genres.includes(genre);
    });
    console.log(filteredGenres);
    setGenres(filteredGenres);
    setConfigLoading(false);
  };

  //getting the token once the page load
  useEffect(() => {
    setAuthLoading(true);

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setAuthLoading(false);
        setToken(storedToken.value);
        loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
    });
  }, []);

  
  //styling
  const centering = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px",
  };
  const container = {
    display: "flex",
    flexDirection: "column",
    padding: 35,
    justifyContent: "center",
    alignItems: "center",
  };
  const formStyle = { m: 1, width: 300, alignItems: "center" };

  return (
    authLoading || configLoading ? <CircularProgress /> :
    <Grid container style={centering}>
      <Grid item xs={12} style={centering}>
        <Typography variant="h2" sx={{ fontStyle: "bold" }}>
          Set Up Game
        </Typography>
      </Grid>

      {error.condition === true && (
        <Grid item xs={12} style={centering}>
          <Alert severity="error">
            Not enough {error.type} in the genre to play the game. Please select
            a different genre!
          </Alert>
        </Grid>
      )}

      <Paper style={container}>
        <FormControl
          variant="outlined"
          sx={{ m: 1, width: 300, alignContent: "center" }}
        >
          <FormLabel id="genre">Select a Genre</FormLabel>
          <Select
            formlabelid="genre"
            id="genre"
            value={selectedGenre}
            label="Genre"
            onChange={(event) => setSelectedGenre(event.target.value)}
          >
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formStyle}>
          <FormLabel id="numArtist">Number of Artist(s)</FormLabel>
          <RadioGroup
            row
            formlabelid="numArtist"
            name="numArtist"
            onChange={(event) => setNumArtist(event.target.value)}
            defaultValue='2'
          >
            <FormControlLabel value={2} control={<Radio />} label="2" />
            <FormControlLabel value={3} control={<Radio />} label="3" />
            <FormControlLabel value={4} control={<Radio />} label="4" />
          </RadioGroup>
        </FormControl>
        <FormControl sx={formStyle}>
          <FormLabel id="numTrack">Number of Track(s)</FormLabel>
          <RadioGroup
            row
            formlabelid="numTrack"
            name="numTrack"
            onChange={(event) => setNumTrack(event.target.value)}
            defaultValue='1'
          >
            <FormControlLabel value={1} control={<Radio />} label="1" />
            <FormControlLabel value={2} control={<Radio />} label="2" />
            <FormControlLabel value={3} control={<Radio />} label="3" />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          style={formStyle}
          onClick={handleSubmit}
        >
          Set Up Game
        </Button>
      </Paper>
    </Grid>
  );
};

export default Home;
