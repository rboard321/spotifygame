import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Grid, Box } from "@mui/material";
import { RestartAlt, PlayCircleFilled, Refresh } from "@mui/icons-material";



const ShowArtists = ({
  artists,
  setResult,
  correctArtist,
  setScore,
  score,
  lives,
  setLives,
  fetchGameData,
  stopSongs,
  checkCorrect
}) => {

  const navigate = useNavigate();

  const checkLives = () => {
    if (lives <= 0 && score >= 100) {
      setResult(true);
      stopSongs()
      navigate("/result");
    } else if (lives <= 1 && score < 100) {
      setResult(false);
      stopSongs()
      navigate("/result");
    } else {

      checkCorrect("wrong");

      fetchGameData();
    }
  };


  const handleStartOver = () => {
    setScore(0)
    setLives(3)
    stopSongs()
    navigate("/")
  }

  const handleClick = id => {

    //checking if artist selected is correct or not
    if (id === correctArtist) {
      setScore(score + 10);
      checkCorrect("right");
      fetchGameData();
    } else {
      setLives(lives - 1);
      checkLives();
    }
  };

  const refresh = () => {
    fetchGameData();
  };

  return (
    <Grid
      container
      style={{
        width: "100%",
        padding: "20px",
        border: "1px solid black",
        borderRadius: "10px",
        textAlign: "center",
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {artists.map(artist => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.white",
              "&:hover": {
                backgroundColor: "primary.paper",
                opacity: [0.5],
                cursor: "pointer",
              },
              padding: "10px 0 0 0",
            }}
            onClick={() => handleClick(artist.id)}
          >
            <img height="100px" src={artist.images[0].url} />
            <br />
            <Typography
              variant="p"
              sx={{
                fontFamily: "Roboto, Helvetica, sans-serif",
                fontSize: "14px",
                marginTop: "-1px",
              }}
            >
              {artist.name.toUpperCase()}
            </Typography>

          </Box>

        </Grid>
      ))}
      <Grid container style={{ display: "flex", justifyContent: "center" }}>
        <Button
          startIcon={<RestartAlt />}
          color="primary"
          size="small"
          variant="contained"
          onClick={() => handleStartOver()}
          style={{ margin: "10px 20px 5px 20px" }}
        >
          Start Over
        </Button>
        <Button
          startIcon={<PlayCircleFilled />}
          style={{ margin: "10px 20px 5px 20px" }}
          color="success"
          size="small"
          variant="contained"
          onClick={refresh}
        >
          Reset
        </Button>
      </Grid>
    </Grid>
  );
};

export default ShowArtists;
