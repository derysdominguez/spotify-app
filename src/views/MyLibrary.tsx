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
    <Container>
      <Row className="d-flex justify-content-center align-items-center">
        {Object.keys(userInfo).length === 0 ? null : (
          <Col className="user-info text-center">
            <img
              src={userInfo.images[0].url}
              alt="profile"
              className="user-icon"
            />
            <span>{userInfo.display_name}</span>
          </Col>
        )}
        <Col xs={2} className="">
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => setShow(true)}
          >
            Export to Spotify
          </Button>
        </Col>
        <Col xs={4}>
          <h1>My Library</h1>
        </Col>
        <Col className="text-center">
          <Link to="/" className="btn btn-warning btn-lg">
            Search
          </Link>
        </Col>
        <Col className="text-center">
          <button onClick={logoutSession} className="btn btn-danger btn-lg">
            Log Out
          </button>
        </Col>
      </Row>
      <Library />

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
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
      <ToastContainer position="top-end">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
        >
          <Toast.Header>
            <strong className="me-auto">Bootstrap</strong>
          </Toast.Header>
          <Toast.Body>Playlist Created Succesfully</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default MyLibrary;
