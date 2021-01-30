import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddModal from "./addModal";
import axios from "axios";
import { Alert, Container, Modal, Row, Card } from "react-bootstrap";

function Image(props) {
  const { imageID } = useParams();

  /**************************************************** States ****************************************** */
  const [isFetchingImage, setisFetchingImage] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [callRefresh, setcallRefresh] = useState(0);
  const [image, setImage] = useState({
    dots: [],
    image: null,
    image_id: "",
    pid: "",
  });
  // console.log("Image: Markers", markers);
  /****************************************************** Body ******************************************** */
  var myDots = [];
  var dots = useSelector((state) => {
    return state.dot.dots;
  });
  console.log("Image: Dots From DB", image.dots);
  console.log("Image: Dots from useState", dots);

  dots.forEach(function (dot) {
    if (dot.parent_id == pid) {
      myDots.push(dot);
    }
  });

  dots = [...image.dots, ...myDots];
  // console.log("Image: Final Dots", dots);

  /****************************************************** useEffects ************************************** */
  useEffect(async () => {
    setisFetchingImage(true);
    if (imageID) {
      let urll = `http://localhost:8000/image/dot/${imageID}/`;
      const resp = await axios.get(urll);
      let url = `http://localhost:8000/image/${imageID}`;
      const res = await axios.get(url);
      if (res.data.length) {
        setImage({
          ...image,
          dots: resp.data,
          pid: res.data[0].pid,
          image: res.data[0].image,
          image_id: res.data[0].image_id,
        });
        var _markers = [];
        resp.data.forEach(function (dot) {
          markers.push({ top: dot.x, left: dot.y });
        });
        setMarkers([...markers, ..._markers]);
        setisFetchingImage(false);
      }
    }
  }, [imageID, callRefresh]);

  /***************************************************** Functions ***************************************** */
  function addMarker(props) {
    return (
      <IconButton
        color="primary"
        aria-label="upload picture"
        component="span"
        onClick={() => {
          console.log("Hello", props.top);
        }}
      >
        <AddCircleIcon />
      </IconButton>
    );
  }
  function photoMarker(props) {
    return (
      <IconButton
        color="primary"
        aria-label="upload picture"
        component="span"
        onClick={() => {
          console.log("Hello", props.top);
        }}
      >
        <PhotoCamera />
      </IconButton>
    );
  }
  function handleAddMarker(marker) {
    setMarkers([...markers, marker]);
    setAddModalShow(true);
  }
  return (
    <>
      {isFetchingImage && (
        <Alert variant="warning">
          Fetching Image Data or check the Image ID
        </Alert>
      )}
      {/* {!isFetchingImage && (
        <Container fluid>
          <Row className="justify-content-sm-center">
            <ReactImageDot
              backgroundImageUrl={"http://localhost:8000" + image.image}
              width="640px"
              height="480px"
              dotRadius={6}
              dotStyles={{
                backgroundColor: "red",
                boxShadow: "0 2px 4px gray",
              }}
              pid={image.image_id}
              Dots={image.dots}
            />
          </Row>
          <Row>
            <DotsInfo
              height={480}
              width={480}
              pid={image.image_id}
              dbDots={image.dots}
              refresh={setcallRefresh}
            />
          </Row>
        </Container>
      )} */}
      {!isFetchingImage && (
        <>
          <Container fluid>
            <Row className="justify-content-sm-center">
              <Card style={{ width: "720px", margin: "15px" }}>
                <ImageMarker
                  src={"http://localhost:8000" + image.image}
                  markers={markers}
                  onAddMarker={handleAddMarker}
                  markerComponent={addMarker}
                />
              </Card>
            </Row>
          </Container>
        </>
      )}
      {addModalShow && (
        <AddModal
          show={addModalShow}
          onHide={() => {
            setAddModalShow(false);
            setMarkers((prev) => {
              prev.pop();
              return [...prev];
            });
          }}
          pid={image.image_id}
          markers={markers}
          refresh={setcallRefresh}
        />
      )}
    </>
  );
}

export default Image;
