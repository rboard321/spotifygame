import React from 'react';
import {Typography, Button, Grid} from '@mui/material';

const Result = ({result, score}) => {
    const centering = {display: "flex", justifyContent: "center", alignItems:"center", margin:"20px"};
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

  return (
    <div>
        {result === true ?
            <Grid container style={centering}>
                <Grid item xs={12} style={centeringBlock}>
                    <Typography variant="h2">Congratulations!</Typography>
                    <Typography variant="h4">You got a score of {score}!</Typography>
                </Grid>
                <Grid item xs={12} style={centering}>
                <iframe src="https://giphy.com/embed/LnWxCO1uWgaGiSUJb0" width="300" height="300" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                </Grid>

                <Grid item xs={12} style={centering}>
                    <Button variant="contained" color="success" href="/game" style={{marginRight:'10px'}}>Continue</Button>
                    <Button variant="contained" color="primary" href="/" style={{marginLeft:'10px'}}>Home</Button>
                </Grid>
            </Grid>
            :
            <Grid container style={centering}>
                <Grid item xs={12} style={centeringBlock}>
                    <Typography variant="h2">Sorry!</Typography>
                    <Typography variant="h4">You lost with a score of {score}!</Typography>
                </Grid>
                <Grid item xs={12} style={centering}>
                <iframe src="https://giphy.com/embed/sEqfAygnULZbMrMdFh" width="300" height="300" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                </Grid>
                
                <Grid item xs={12} style={centering}>
                    <Button variant="contained" color="warning" href="/game" style={{marginRight:'10px'}}>Retry</Button>
                    <Button variant="contained" color="primary" href="/" style={{marginLeft:'10px'}}>Home</Button>
                </Grid>
            </Grid>
        }
    </div>
  )
}


export default Result;