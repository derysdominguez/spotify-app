import React from "react";
import { Container, Row } from "react-bootstrap";
import { useAppSelector } from "../../hooks";
import Track from "../Track";
import { libraryDocType } from "../../views/MyLibrary";

const Library = () => {
  const library: any = useAppSelector((state) => state.myLibrary.library);

  return (
    <Container className="library">
      <Row>
        {Object.keys(library).length === 0 ? (
          <h1>No items on your Library</h1>
        ) : (
          library.map((doc: libraryDocType) => <Track key={doc.id} track={doc.track} />)
        )}
      </Row>
    </Container>
  );
};

export default Library;
