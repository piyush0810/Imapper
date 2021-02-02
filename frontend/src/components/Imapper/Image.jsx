import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ImageMarker from "react-image-marker";
import axios from "axios";
import {
  Alert as alert,
  Container,
  Row,
  Card,
  Dropdown,
  Button,
} from "react-bootstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import SettingsInputAntennaSharpIcon from "@material-ui/icons/SettingsInputAntennaSharp";
import IconButton from "@material-ui/core/IconButton";
import PhotoLibrarySharpIcon from "@material-ui/icons/PhotoLibrarySharp";
import AddModal from "./addModal";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

/************************************************************* Global Functions ************************* */
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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
  /************************************************** Hooks ********************************************* */
  const { imageID } = useParams();
  var history = useHistory();
  const dispatch = useDispatch();
  var sensors = useSelector((state) => {
    return state.sensor;
  });
  var images = useSelector((state) => {
    return state.img;
  });
  const currUser = useSelector((state) => state.curr_user);
  /********************************************************* States *********************************************** */
  const [isFetchingImage, setisFetchingImage] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackMSG, setsnackMSG] = useState("");
  const [markers, setMarkers] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [callRefresh, setcallRefresh] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [image, setImage] = useState({
    dots: [],
    image: null,
    image_id: "",
    pid: "",
  });
  const [deleteData, setDeleteData] = useState({ id: "", isImage: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  /*********************************************************** Body ******************************************** */
  var dots = [...image.dots];
  let clicks = [];
  let timeout;

  /******************************************************* Console Statements ******************************** */
  console.log("Image: Sensors From Store", sensors);
  console.log("Image: Images From Store", images);
  console.log("Image: Markers", markers);
  console.log("Image: Dots From DB", dots);
  /****************************************************** useEffects ************************************** */
  useEffect(async () => {
    setisFetchingImage(true);
    if (imageID) {
      let urll = `http://localhost:8000/image/dot/${imageID}/`;
      const resp = await axios.get(urll, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
        },
      });
      let url = `http://localhost:8000/image/${imageID}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
        },
      });
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
          _markers.push({ top: dot.x, left: dot.y });
        });

        url = "http://localhost:8000/sensor/sensors/";
        const respp = await axios.get(url, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
          },
        });
        dispatch({
          type: "FETCH_SENSORS",
          payload: respp.data,
        });

        url = `http://localhost:8000/image/images/${currUser.username}`;
        const resppp = await axios.get(url, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
          },
        });
        dispatch({
          type: "FETCH_IMAGES",
          payload: resppp.data,
        });
        setMarkers([..._markers]);
        setisFetchingImage(false);
      }
    }
  }, [imageID, callRefresh]);

  /***************************************************** Functions ***************************************** */
  function singleClick(event, id, isImage) {
    console.log("Image: SingleClick");
    if (isImage) {
      history.push(`/image/${id}`);
    }
  }

  function doubleClick(event, id, isImage) {
    setOpenDeleteDialog(true);
    setDeleteData({ id: id, isImage: isImage });
  }

  function clickHandler(event, id, dot_id, isImage) {
    event.preventDefault();
    clicks.push(new Date().getTime());
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      if (
        clicks.length > 1 &&
        clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250
      ) {
        doubleClick(event.target, dot_id, isImage);
      } else {
        singleClick(event.target, id, isImage);
      }
    }, 250);
  }
  async function deleteDot(id, isImage) {
    console.log("Image: DeleteDot called");
    setIsDeleting(true);

    let url = `http://localhost:8000/image/dotdel/${id}/`;
    console.log("Image: Database Dot called");
    await axios.delete(url);
    console.log("Image: Refreshcalled");
    setcallRefresh((p) => {
      return p + 1;
    });

    setIsDeleting(false);
    if (isImage) {
      setsnackMSG("Successfully Deleted Image");
    } else {
      setsnackMSG("Successfully Deleted Sensor");
    }
    setOpen(true);
  }
  function addMarker(props) {
    var x = props.top;
    var y = props.left;
    var isImage = false;
    var id = "";
    var dot_id = "";
    dots.forEach(function (dot) {
      if (dot.x == x && dot.y == y) {
        id = dot.child_id;
        dot_id = dot.dot_id;
        if (dot.is_image) {
          isImage = true;
        }
      }
    });
    return isImage ? PhotoMarker(id, dot_id) : SensorMarker(id, dot_id);
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
  function SensorMarker(id, dot_id) {
    var title = "Sensor";
    if (id) {
      var sensor = getSensorByID(id);
      title = (
        <>
          {isDeleting && <CircularProgress color="secondary" />}
          {!isDeleting && (
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
          )}
        </>
      );
    }
    return (
      <HtmlTooltip title={title} arrow>
        <IconButton
          component="span"
          onClick={(e) => {
            var isImage = false;
            clickHandler(e, id, dot_id, isImage);
          }}
        >
          <SettingsInputAntennaSharpIcon color="secondary" fontSize="large" />
        </IconButton>
      </HtmlTooltip>
    );
  }
  function PhotoMarker(id, dot_id) {
    var title = "Image";
    if (id) {
      var image = getImageByID(id);
      title = (
        <>
          {isDeleting && <CircularProgress color="secondary" />}
          {!isDeleting && (
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
          )}
        </>
      );
    }
    return (
      <HtmlTooltip title={title} arrow>
        <IconButton
          style={{ color: "#2a3eb1" }}
          component="span"
          onClick={(e) => {
            var isImage = true;
            clickHandler(e, id, dot_id, isImage);
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
  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  /****************************************************** Render Function ********************************* */
  return (
    <>
      {isFetchingImage && (
        <alert variant="warning">
          Fetching Image Data or check the Image ID
        </alert>
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
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackMSG}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Do you really want to delete this ${
            deleteData.isImage ? "Image" : "Sensor"
          } ?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This {deleteData.isImage ? "Image" : "Sensor"} will be permanently
            deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setDeleteData({ id: "", isImage: "" });
            }}
            color="secondary"
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              deleteDot(deleteData.id, deleteData.isImage);
              setOpenDeleteDialog(false);
              setDeleteData({ id: "", isImage: "" });
            }}
            color="primary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Image;
