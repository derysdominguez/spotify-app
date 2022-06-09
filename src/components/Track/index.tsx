import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../../config/firebase";
import { useAppSelector } from "../../hooks";
import { TrackType } from "../../views/Home";
import { libraryDocType } from "../../views/MyLibrary";

type Props = {
  track: TrackType;
  isNewRelease: boolean;
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
    <Col
      className="track py-2"
      lg={isNewRelease ? { span: 12 } : { span: 3 }}
      md={isNewRelease ? { span: 12 } : { span: 6 }}
      sm={isNewRelease ? { span: 12 } : { span: 12 }}
      >
      <div>
      {isNewRelease ? null : (
        <Button onClick={handleRemove} className="action-btn mt-2">
          #268A
        </Button>
      )}
        <img src={track.albumImage} alt={track.title} className="albumImage" />
        <div className="trackName mt-2">{track.title}</div>
        <div className="artist mt-2">{track.artist}</div>
      </div>
    </Col>
  );
};

export default Track;
