import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Howl, Howler } from "howler";
import { Cancel, PlayCircle } from "@mui/icons-material";
import { Button } from "@mui/material";

const Showsong = ({ artists, tracks, songOptions, selectSong, stopSongs}) => {
  

  return (
    <div>
      {songOptions.map((_, indx) => {
        return (
          <div key={indx}>
            <Button startIcon={<PlayCircle />} color="success" onClick={() => selectSong(indx)}>
              Play Sample {indx + 1}
            </Button>
          </div>
        );
      })}
      <Button startIcon={<Cancel />} color="error" onClick={e => stopSongs()}>
        Stop the Music!
      </Button>
    </div>
  );
};

export default Showsong;
