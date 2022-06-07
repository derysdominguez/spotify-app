import React from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
// import { compose } from '@reduxjs/toolkit'
// import { connect } from 'react-redux';
// import { firestoreConnect } from 'react-redux-firebase'
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { Container } from "react-bootstrap";
import { TrackType } from "./Home";
import Track from "../components/Track";
import { useAppDispatch, useAppSelector } from "../hooks";
import { set_library } from "../app/reducers/librarySlice";
import Library from "../components/library";

export type libraryDocType = {
  track: TrackType;
  id: string;
};

type Props = {};

const MyLibrary = (props: Props) => {
  const dispatch = useAppDispatch();
  const [library, setLibrary] = useState([] as libraryDocType[]);

  const userInfo: any = useAppSelector((state) => state.userInfo.userInfo);

  useEffect(() => {
    getLibrary();
  }, []);

  useEffect(() => {
    dispatch(set_library(library));
  }, [library]);

  
  const getLibrary = async () => {
    const libraryCollectionRef = collection(db, "userLibrary");
    const getTrackByUser = await query(collection(db, "userLibrary"), where("userId", "==", userInfo.id));

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

        // setLibrary(tracks);
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <Library />
  );
};

export default MyLibrary;
