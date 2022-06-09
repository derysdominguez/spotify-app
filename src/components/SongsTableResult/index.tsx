import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { set_library } from "../../app/reducers/librarySlice";
import { db } from "../../config/firebase";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { TrackType } from "../../views/Home";
import { useEffect } from "react";

type Props = {
  track: TrackType;
};

const SongsTable: React.FC<Props> = ({ track }) => {
  const dispatch = useAppDispatch();

  const library: any = useAppSelector((state) => state.myLibrary.library);
  const userInfoId: any = useAppSelector((state) => state.userInfo.userInfo.id);

  const OnLibrary = (id: string) => {
    return library.find((doc: any) => doc.track.track_id === id);
  };

  const handleAdd = (e: any) => {
    e.preventDefault();

    const libraryCollectionRef = collection(db, "userLibrary");

    addDoc(libraryCollectionRef, {
      albumImage: track.albumImage,
      albumName: track.albumName,
      artist: track.artist,
      duration: track.duration,
      title: track.title,
      uri: track.uri,
      userId: userInfoId,
      track_id: track.track_id,
    }).then((res) => {
      console.log(res.id);
    });
  };

  const handleRemove = async () => {
    const document = OnLibrary(track.track_id);
    await deleteDoc(doc(db, "userLibrary", document.id)).then((res) => {
      console.log("deleted");
    });
  };

  return (
    <tr>
      <td>
        <img src={track.albumImage} alt={track.albumName} />
      </td>
      <td>
        <p className="title">{track.title}</p>
        <p className="artist">{track.artist}</p>
      </td>
      <td className="d-none d-sm-table-cell">{track.albumName}</td>
      <td className="d-none d-sm-table-cell">{track.duration}</td>
      <td>
        {OnLibrary(track.track_id) ? (
          <Button className="btn action-btn btn-danger" onClick={handleRemove}>
            <i className="bi bi-dash" />
          </Button>
        ) : (
          <Button className="action-btn" onClick={handleAdd}>
            <i className="bi bi-plus" />
          </Button>
        )}
        {/* {
        <Button variant="dark">+</Button>} */}
      </td>
    </tr>
  );
};
export default SongsTable;
