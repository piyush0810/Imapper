import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import SettingsInputAntennaSharpIcon from "@material-ui/icons/SettingsInputAntennaSharp";
import IconButton from "@material-ui/core/IconButton";
import PhotoLibrarySharpIcon from "@material-ui/icons/PhotoLibrarySharp";
import AddModal from "./addModal";
import axios from "axios";
import { Alert, Container, Modal, Row, Card, Dropdown } from "react-bootstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "auto",
    padding: "1px",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);
function Image(props) {
  const { imageID } = useParams();
  /************************************************** Store ********************************************* */
  const dispatch = useDispatch();
  var dots = useSelector((state) => {
    return state.dot.dots;
  });
  var sensors = useSelector((state) => {
    return state.sensor;
  });
  var images = useSelector((state) => {
    return state.img;
  });
  console.log("Image: Sensors From Store", sensors);
  console.log("Image: Images From Store", images);
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

  dots.forEach(function (dot) {
    if (dot.parent_id == pid) {
      myDots.push(dot);
    }
  });

  dots = [...image.dots, ...myDots];
  // console.log("Image: Final Dots", dots);
  console.log("Image: Dots From DB", image.dots);
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

        url = "http://localhost:8000/sensor/sensors/";
        const respp = await axios.get(url);
        dispatch({
          type: "FETCH_SENSORS",
          payload: respp.data,
        });

        url = "http://localhost:8000/image/images/";
        const resppp = await axios.get(url);
        dispatch({
          type: "FETCH_IMAGES",
          payload: resppp.data,
        });
        setMarkers([...markers, ..._markers]);
        setisFetchingImage(false);
      }
    }
  }, [imageID, callRefresh]);

  /***************************************************** Functions ***************************************** */

  function addMarker(props) {
    var x = props.top;
    var y = props.left;
    var isImage = false;
    var id = "";
    dots.forEach(function (dot) {
      if (dot.x == x && dot.y == y) {
        id = dot.child_id;
        if (dot.is_image) {
          isImage = true;
        }
      }
    });
    return isImage ? PhotoMarker(id) : SensorMarker(id);
  }
  function getSensorByID(id) {
    for (var key in sensors) {
      if (sensors[key].sensor_id == id) {
        return sensors[key];
      }
    }
    return "";
  }
  function getImageByID(id) {
    for (var key in images) {
      if (images[key].image_id == id) {
        return images[key];
      }
    }
    return "";
  }
  function SensorMarker(id) {
    var title = "Sensor";
    if (id) {
      var sensor = getSensorByID(id);
      title = (
        <Card>
          <Card.Body style={{ textAlign: "center" }}>
            <Card.Title>
              {sensor.sensor_name === "temperature"
                ? "Temperature"
                : "Pressure"}
            </Card.Title>
            <Card.Subtitle
              className="mb-2 text-muted"
              style={{ padding: "5px" }}
            >
              Units {sensor.unit}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      );
    }
    return (
      <HtmlTooltip title={title} arrow>
        <IconButton
          component="span"
          onClick={() => {
            console.log("Hello Sensor", props.top);
          }}
        >
          <SettingsInputAntennaSharpIcon color="secondary" fontSize="large" />
        </IconButton>
      </HtmlTooltip>
    );
  }
  function PhotoMarker(id) {
    var title = "Image";
    if (id) {
      var image = getImageByID(id);
      title = (
        <Card.Img
          className="box"
          variant="top"
          src={"http://localhost:8000" + image.image}
          style={{
            maxHeight: "auto",
            maxWidth: "300px",
            minWidth: "150px",
            padding: "1px",
          }}
        />
      );
    }
    return (
      <HtmlTooltip title={title} arrow>
        <IconButton
          style={{ color: "#2a3eb1" }}
          component="span"
          onClick={() => {
            console.log("Hello Sensor", props.top);
          }}
        >
          <PhotoLibrarySharpIcon fontSize="large" />
        </IconButton>
      </HtmlTooltip>
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
      {!isFetchingImage && (
        <>
          <Container>
            <Row className="justify-content-sm-center">
              <Card
                style={{
                  maxWidth: window.innerWidth,
                  maxHeight: window.innerHeight,
                  margin: "15px",
                }}
              >
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
