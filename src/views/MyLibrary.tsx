import React from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { TrackType } from "./Home";
import { useAppDispatch, useAppSelector, useAuth } from "../hooks";
import { set_library } from "../app/reducers/librarySlice";
import Library from "../components/library";
import { logout } from "../app/actions";
import { Link } from "react-router-dom";
import axios from "axios";

type Props = {
  token: string | null;
};

export type libraryDocType = {
  track: TrackType;
  id: string;
};

const MyLibrary = (props: Props) => {
  const dispatch = useAppDispatch();
  const [library, setLibrary] = useState([] as libraryDocType[]);

  const userInfo: any = useAppSelector((state) => state.userInfo.userInfo);

  const access_token = useAuth(props.token);

  //Modal
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");

  const logoutSession = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    window.location.assign("/");
  };

  const handleExport = (formData: any) => {
    axios
      .post(
        `https://api.spotify.com/v1/users/${userInfo.id}/playlists`,
        {
          name: playlistName,
          description: playlistDescription,
          public: false,
        },
        {
          headers: {
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setPlaylistLink(res.data.uri);
        const uris = library.map((doc: any) => {
          return doc.track.uri;
        });
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${
              res.data.id
            }/tracks?uris=${uris.toString()}`,
            {},
            {
              headers: {
                Authorization: "Bearer " + props.token,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            setShow(false);
            setShowToast(true);
          });
      })
      .catch(console.error);
  };

  useEffect(() => {
    dispatch(set_library(library));
  }, [library]);

  useEffect(() => {
    const getTrackByUserRef = query(
      collection(db, "userLibrary"),
      where("userId", "==", userInfo.id)
    );

    const unsubcribe = onSnapshot(getTrackByUserRef, (snapshot) => {
      setLibrary(
        snapshot.docs.map((doc: any) => ({
          track: doc.data(),
          id: doc.id,
        }))
      );
    });

    return () => {
      unsubcribe();
    };
  }, [userInfo]);
  return (
    <Container className="myLibrary">
      <div className="bckgradient"></div>
      <Row className="d-flex justify-content-center align-items-center  py-5">
        {Object.keys(userInfo).length === 0 ? null : (
          <Col xs={2} className="user-info text-center">
            <img
              src={userInfo.images[0].url}
              alt="profile"
              className="user-icon"
            />
            <span className="d-none d-md-inline-block">{userInfo.display_name}</span>
          </Col>
        )}
        <Col xs={2} md={3} className="text-center">
          <button onClick={() => setShow(true)}  className="btn">
          <i className="bi bi-music-note-list">
              <span className="d-none d-md-inline-block">Export Playlist</span>
            </i>
          </button>
        </Col>

        <Col xs={2} md={3} className="text-center">
          <Link to="/">
            <button className="btn link">
              <i className="bi bi-house">
                <span className="d-none d-md-inline-block">Home</span>
              </i>
            </button>
          </Link>
        </Col>
        <Col xs={2} md={1} lg={2} className="text-center">
          <button onClick={logoutSession} className="btn">
            <i className="bi bi-box-arrow-in-left me-1">
              <span className="d-none d-lg-inline-block">Logout</span>
            </i>
          </button>
        </Col>
      </Row>

      <h1>My Library</h1>

      <Library />

      <Modal show={show} onHide={() => setShow(false)} className="modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Export your Library as Spotify Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleExport}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Playlist Name</Form.Label>
              <Form.Control
                placeholder="Set playlist name"
                type="text"
                autoFocus
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Playlist Description </Form.Label>
              <Form.Control
                placeholder="Set playlist description"
                type="text"
                onChange={(e) => setPlaylistDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleExport}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-start">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={6000} autohide>
          <Toast.Header>
            <strong className="me-auto">Playlist Created Succesfully</strong>
          </Toast.Header>
          <Toast.Body>Go to <a href={playlistLink}>{playlistName}</a></Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default MyLibrary;
