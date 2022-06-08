import React from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { Container, Row, Col } from "react-bootstrap";
import { TrackType } from "./Home";
import { useAppDispatch, useAppSelector, useAuth } from "../hooks";
import { set_library } from "../app/reducers/librarySlice";
import Library from "../components/library";
import { logout } from "../app/actions";
import { Link } from "react-router-dom";

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

  const logoutSession = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    window.location.assign('/')
  };

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
          <Link to="/" className="btn btn-btn btn-outline-success">
            Export to Spotify
          </Link>
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
      <Library />;
    </Container>
  );
};

export default MyLibrary;
