import React from "react";
import { Table } from "react-bootstrap";
import { TrackType } from "../../views/Home";

type Props = {
  track: TrackType;
};

const SongsTable: React.FC<Props> = ({ track }) => (
      <tr>
        <td>
            <img src={track.albumImage} alt={track.albumName}/>
        </td>
        <td>{track.title}</td>
        <td>{track.artist}</td>
        <td>{track.albumName}</td>
        <td>{track.duration}</td>
        <td>{}</td>
      </tr>
);

export default SongsTable;
