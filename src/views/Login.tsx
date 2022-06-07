import React from "react";

import axios from "axios";
import { Container } from "react-bootstrap";
import { useAuth } from "../hooks/index";

const client_id = "3256515de1b54e59a77c805ef0bf193b";
const redirect_uri = "http://localhost:3000/";
const api_uri = "https://accounts.spotify.com/authorize";
const scope = [
  "user-read-private",
  "user-read-email",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-read-currently-playing",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
];

const Login = () => {
  const handleClick = async () => {
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <button className="btn btn-success btn-lg" onClick={handleClick}>
        Log in with Spotify
      </button>
    </Container>
  );
};

export default Login;
