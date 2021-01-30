import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddModal from "./addModal";
import axios from "axios";
import { Alert, Container, Modal, Row, Card } from "react-bootstrap";

function Image(props) {
  console.log("Image: Image Component Rendered");

  const { imageID } = useParams();
  const [isFetchingImage, setisFetchingImage] = useState(true);
  const [markers, setMarkers] = useState([]);
  console.log("Image: Markers", markers);
  const [addModalShow, setAddModalShow] = useState(false);
  const [callRefresh, setcallRefresh] = useState(0);
  const [image, setImage] = useState({
    dots: [],
    image: null,
    image_id: "",
    pid: "",
  });
  console.log("Image: Image State:", image);
  console.log("Image: Completed Rendered Image");
  useEffect(async () => {
    console.log("Image: Fetiching useEffect called");
    setisFetchingImage(true);
    if (imageID) {
      let urll = `http://localhost:8000/image/dot/${imageID}/`;
      // console.log(`Image: sending GET req to ${urll}`);
      const resp = await axios.get(urll);
      // console.log("Image:Dots Response Recieved", resp.data);
      //fetching Image Data from DB
      let url = `http://localhost:8000/image/${imageID}`;
      // console.log(`Image: sending GET req to ${url}`);
      const res = await axios.get(url);
      // console.log("Image: Printing Fetched Image Data:", res.data);
      // console.log("Image: Setting Image Data & Dots");
      if (res.data.length) {
        setImage({
          ...image,
          dots: resp.data,
          pid: res.data[0].pid,
          image: res.data[0].image,
          image_id: res.data[0].image_id,
        });
        // console.log("Image: Changing Flag");
        setisFetchingImage(false);
        console.log("Image:  Fetiching useEffect Complete");
      }
    }
  }, [imageID, callRefresh]);
  const photoMarker = (props) => {
    return (
      <AddCircleIcon
        onClick={() => {
          console.log("Hello", props.top);
        }}
      />
    );
  };
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
                  markerComponent={photoMarker}
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
        />
      )}
    </>
  );
}

export default Image;
