import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../../config/firebase";
import { useAppSelector } from "../../hooks";
import { TrackType } from "../../views/Home";
import { libraryDocType } from "../../views/MyLibrary";

type Props = {
  track: TrackType;
  isNewRelease: boolean
};

const Track: React.FC<Props> = ({ track, isNewRelease }) => {
  const library: any = useAppSelector((state) => state.myLibrary.library);

  const OnLibrary = (id: string) => {
    return library.find((doc: any) => doc.track.track_id === id);
  };

  const handleRemove = async () => {
    const document = OnLibrary(track.track_id);
    await deleteDoc(doc(db, "userLibrary", document.id)).then((res) => {
      console.log("deleted");
    });
  };

  return (
    <Col className="track" md={{ span: 3 }}>
      <img src={track.albumImage} alt={track.title} />
      <h2>{track.title}</h2>
      <h4>{track.artist}</h4>
      { isNewRelease ? null:
      <Button variant="dark" onClick={handleRemove}>
        -
      </Button>
      }
    </Col>
  );
};

export default Track;
