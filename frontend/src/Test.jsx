import { useState, useEffect, useRef, shallowEqual } from "react";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";

const CustomMarker = (props) => {
  return (
    <PhotoCameraIcon
      onClick={() => {
        console.log("Hello", props.top);
      }}
    />
  );
};
function Test(params) {
  const [markers, setMarkers] = useState([{}]);
  console.log(markers);
  return (
    <>
      <ImageMarker
        src="http://localhost:8000/media/post_images/6ZHSSKmz8lU_8obHpir.jpg"
        markers={markers}
        onAddMarker={(marker: Marker) => setMarkers([...markers, marker])}
        markerComponent={CustomMarker}
      />
    </>
  );
}

export default Test;
