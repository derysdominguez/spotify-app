import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login, logout } from "../app/reducers/logginSlice";
import { useAuth } from "../hooks/index";
import { useEffect } from "react";
import { Col, Container, Form, Row, Table } from "react-bootstrap";
import axios from "axios";
import SongsTable from "../components/SongsTableResult";
import { set_user } from "../app/reducers/userSlice";
import { Link } from "react-router-dom";
import MyLibrary, { libraryDocType } from "./MyLibrary";
import Track from "../components/Track";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { set_library } from "../app/reducers/librarySlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import userIcon from '../assets/img/default-user.jpg'

type Props = {
  token: string | null;
};

export type TrackType = {
  artist: string;
  title: string;
  duration: number | null;
  uri: string | null;
  albumName: string;
  albumImage: string;
  track_id: string;
};

const Home: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useAppDispatch();
  const userInfo: any = useAppSelector((state) => state.userInfo.userInfo);

  const access_token = useAuth(props.token);
  const [search, setSearch] = useState<string | null>("");
  const [searchResults, setSearchResults] = useState([] as TrackType[]);
  const [newReleases, setNewReleases] = useState([] as TrackType[]);
  const [library, setLibrary] = useState([] as libraryDocType[]);
  const [user_access, setUserAccess] = useState(true);

  console.log(searchResults);
  const logoutSession = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    dispatch(set_library(library));
  }, [library]);

  useEffect(() => {
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + props.token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch(set_user(res.data));
      })
      .catch((err) => {
        if (err.response.status == 403) {
          setUserAccess(false);
        }
        if (err.response.data.error.message === "The access token expired") {
          logoutSession();
        }
      });
  }, [access_token]);

  useEffect(() => {
    if (!search) return setSearchResults([]);

    axios
      .get(
        `https://api.spotify.com/v1/search?q=${search}&type=track&limit=20&access_token=${access_token}`
      )
      .then((res) => {
        setSearchResults(
          res.data.tracks.items.map((track: any) => {
            const convertDuration = (ms: number) => {
              ms = track.duration_ms;
              const minutos = Math.floor(ms / 1000 / 60);
              ms -= minutos * 60 * 1000;
              const segundos = Math.round(ms / 1000);

              return minutos + ":" + segundos;
            };
            return {
              artist: track.artists[0].name,
              title: track.name,
              duration: convertDuration(track.duration_ms),
              uri: track.uri,
              albumName: track.album.name,
              albumImage: track.album.images[0].url,
              track_id: track.id,
            };
          })
        );
      });
  }, [search]);

  useEffect(() => {
    axios
      .get(
        "https://api.spotify.com/v1/browse/new-releases?country=US&limit=15&offset=5",
        {
          headers: {
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setNewReleases(
          res.data.albums.items.map((album: any) => {
            return {
              artist: album.artists[0].name,
              title: album.name,
              uri: album.uri,
              albumImage: album.images[0].url,
            };
          })
        );
      });
  }, []);

  useEffect(() => {
    const getTrackByUser = query(
      collection(db, "userLibrary"),
      where("userId", "==", userInfo.id)
    );

    getDocs(getTrackByUser)
      .then((res) => {
        setLibrary(
          res.docs.map((doc: any) => {
            return {
              track: doc.data(),
              id: doc.id,
            };
          })
        );
      })
      .catch((err) => console.log(err.message));
  }, [userInfo]);

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

  return user_access ? (
    <Container className="home">
      <div className="bckgradient"></div>
      <Row className="d-flex justify-content-center align-items-center py-5">
        {Object.keys(userInfo).length === 0 ? null : (
          <Col className="user-info text-center" xs={1} sm={2}>
            <img
              src={userInfo.images.length > 0 ? userInfo.images[0].url : userIcon}
              alt="profile"
              className="user-icon"
            />
            <span className="d-none d-sm-inline-block">
              {userInfo.display_name}
            </span>
          </Col>
        )}
        <Col xs={7} sm={5} lg={6}>
          <input
            type="search"
            placeholder="Search Music on Spotify"
            onChange={(event) => setSearch(event.target.value)}
          />
        </Col>
        <Col className="text-center" xs={1} sm={3} lg={2}>
          <Link to="/library">
            <button className="btn link">
              <i className="bi bi-collection">
                <span className="d-none d-sm-inline-block">My Library</span>
              </i>
            </button>
          </Link>
        </Col>
        <Col className="text-center" xs={1} lg={2}>
          <button onClick={logoutSession} className="btn">
            <i className="bi bi-box-arrow-in-left">
              <span className="d-none d-lg-inline-block">Logout</span>
            </i>
          </button>
        </Col>
      </Row>

      <h1>New Releases</h1>
      <Row className="mt-5">
        <Swiper
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
          }}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {newReleases.length > 0 ? (
            newReleases.map((album) => (
              <SwiperSlide>
                <Track track={album} isNewRelease />
              </SwiperSlide>
            ))
          ) : (
            <h1>No new Releases</h1>
          )}
        </Swiper>
      </Row>

      <Row className="mt-5">
        {searchResults.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th className="d-none d-sm-table-cell">Album</th>
                <th className="d-none d-sm-table-cell">Duration</th>
                <th>
                  <i className="bi bi-collection" />
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((track) => (
                <SongsTable track={track} />
              ))}
            </tbody>
          </Table>
        ) : (
          <h1>No results</h1>
        )}
      </Row>
    </Container>
  ) : (
    <Container className="d-flex justify-content-center align-items-center error-access text-center">
      <Row>
        <h2>User not registered in the Developer Dashboard</h2>
        <h4>Ask the admin for permissions to access the app.</h4>
        <button onClick={logoutSession} className="btn">
          <i className="bi bi-box-arrow-in-left">
            <span className="d-none d-lg-inline-block">Logout</span>
          </i>
        </button>
      </Row>
    </Container>
  );
};

export default Home;
