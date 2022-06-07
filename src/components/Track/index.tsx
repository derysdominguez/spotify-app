import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TrackType } from "../../views/Home";
import { libraryDocType } from "../../views/MyLibrary";

type Props = {
  track: TrackType;
};

const Track: React.FC<Props> = ({ track }) => {
  return (
    <Col className="track" md={{ span: 3 }}>
      <img src={track.albumImage} alt={track.title} />
      <h2>{track.title}</h2>
      <h4>{track.artist}</h4>
    </Col>
  );
};

export default Track;
