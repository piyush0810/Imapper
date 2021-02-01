import { useState, useEffect, useRef, shallowEqual } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Alert as alert,
  Button,
  Modal,
} from "react-bootstrap";
import ImageMarker from "react-image-marker";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import SettingsInputAntennaSharpIcon from "@material-ui/icons/SettingsInputAntennaSharp";
import IconButton from "@material-ui/core/IconButton";
import PhotoLibrarySharpIcon from "@material-ui/icons/PhotoLibrarySharp";

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

function ViewImage() {
  /*********************************************************** Hooks ******************************************************* */
  const { imageID } = useParams();
  const dispatch = useDispatch();
  var history = useHistory();
  var images = useSelector((state) => {
    return state.img;
  }, shallowEqual);
  var sensors = useSelector((state) => {
    return state.sensor;
  }, shallowEqual);
  const currUser = useSelector((state) => state.curr_user);
  /************************************************************ States ******************************************************* */
  const [mergeState, setMergeState] = useState({
    modalShow: false,
    currSensor: "",
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingParentImg, setisFetchingParentImg] = useState(true);
  const [isFetchingSensor, setIsFetchingSensor] = useState(true);
  const [parentImg, setparentImg] = useState({
    dots: [],
    image: null,
    image_id: "",
    pid: "",
    aggDataP: "",
    aggDataT: "",
  });
  const [markers, setMarkers] = useState([]);
  /*********************************************************** Body ********************************************************* */
  let parentId = imageID;
  var parentImgURL = "";
  var dots = [...parentImg.dots];
  let imgArray = [];
  let senArray = [];

  if (parentId) {
    if (!isFetching) {
      for (let key in images) {
        if (images[key].pid === parentId) {
          imgArray.push(images[key]);
        }
        if (images[key].image_id == parentId) {
          parentImgURL = images[key].image;
        }
      }
      for (let key in sensors) {
        if (sensors[key].pid === parentId) {
          senArray.push(sensors[key]);
        }
      }
    }
  }
  /******************************************************** Console Statements *************************************************** */
  console.log("ViewImage: All Images From Store", images);
  console.log("ViewImage: All Sensors From Store", sensors);
  console.log("ViewImage: Images of parent image:", imgArray);
  console.log("ViewImage: Sensors of parent image:", senArray);
  console.log("ViewImage: MergeState State:", mergeState);
  console.log("ViewImage: Parent Image State:", parentImg);
  console.log("ViewImage: Dots From DB", parentImg.dots);
  /*********************************************************** Use Effects ********************************************** */

  useEffect(async () => {
    // Fetching all Sensors and Images
    setIsFetching(true);
    let url = "http://localhost:8000/sensor/sensors/";
    const resp = await axios.get(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    dispatch({
      type: "FETCH_SENSORS",
      payload: resp.data,
    });
    url = `http://localhost:8000/image/images/${currUser.username}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    dispatch({
      type: "FETCH_IMAGES",
      payload: res.data,
    });
    setIsFetching(false);
  }, []);

  useEffect(async () => {
    //Fetching parent image Data
    if (parentId) {
      setisFetchingParentImg(true);
      let url = `http://localhost:8000/image/dot/${parentId}/`;
      const resp = await axios.get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
        },
      });
      url = `http://localhost:8000/image/${parentId}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
        },
      });
      // url = `http://localhost:8000/image/value/${parentId}/pressure`;
      // const ressP = await axios.get(url, {
      //   headers: {
      //     Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      //   },
      // });
      // url = `http://localhost:8000/image/value/${parentId}/temperature`;
      // const ressT = await axios.get(url, {
      //   headers: {
      //     Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      //   },
      // });
      // console.log("ViewImage: Agg DataP", ressP.data);
      // console.log("ViewImage: Agg DataT", ressT.data);
      // var sizeP = ressP.data.length;
      var tempP = [];
      var unitP = "atm";
      // var sizeT = ressT.data.length;
      var tempT = [];
      var unitT = "Celsius";
      // for (let index = 0; index < sizeP; index++) {
      //   tempP.push(index.toString());
      // }
      // for (let index = 0; index < sizeT; index++) {
      //   tempT.push(index.toString());
      // }
      //data: [...ressP.data, 0],
      var dataP = {
        dataLine: {
          labels: [...tempP],
          datasets: [
            {
              label: `Unit: ${unitP}`,
              fill: true,
              lineTension: 0.3,
              backgroundColor: "rgba(225, 204,230, .3)",
              borderColor: "rgb(205, 130, 158)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgb(205, 130,1 58)",
              pointBackgroundColor: "rgb(255, 255, 255)",
              pointBorderWidth: 10,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgb(0, 0, 0)",
              pointHoverBorderColor: "rgba(220, 220, 220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [],
            },
          ],
        },
      };
      //data: [...ressT.data, 0],
      var dataT = {
        dataLine: {
          labels: [...tempT],
          datasets: [
            {
              label: `Unit: ${unitT}`,
              fill: true,
              lineTension: 0.3,
              backgroundColor: "rgba(225, 204,230, .3)",
              borderColor: "rgb(205, 130, 158)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgb(205, 130,1 58)",
              pointBackgroundColor: "rgb(255, 255, 255)",
              pointBorderWidth: 10,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgb(0, 0, 0)",
              pointHoverBorderColor: "rgba(220, 220, 220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [0],
            },
          ],
        },
      };

      if (res.data.length) {
        setparentImg({
          ...parentImg,
          dots: resp.data,
          pid: res.data[0].pid,
          image: res.data[0].image,
          image_id: res.data[0].image_id,
          aggDataP: dataP,
          aggDataT: dataT,
        });
        var _markers = [];
        resp.data.forEach(function (dot) {
          _markers.push({ top: dot.x, left: dot.y });
        });
        setMarkers([..._markers]);
        setisFetchingParentImg(false);
      }
    } else {
      console.log("Parent ID Not Defined");
    }
  }, [parentId]);
  /*********************************************************** Functions ********************************************** */
  async function handleShowGraph(id) {
    setIsFetchingSensor(true);
    let urll = `http://localhost:8000/sensor/${id}/`;
    const resp = await axios.get(urll, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    // console.log("Sensor Data recieved", resp.data[0]);
    setMergeState({ modalShow: true, currSensor: resp.data[0] });
    setIsFetchingSensor(false);
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
        </>
      );
    }
    return (
      <HtmlTooltip title={title} arrow>
        <IconButton
          component="span"
          onClick={() => {
            handleShowGraph(sensor.sensor_id);
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
        </>
      );
    }
    return (
      <HtmlTooltip title={title} arrow>
        <IconButton
          style={{ color: "#2a3eb1" }}
          component="span"
          onClick={(e) => {
            history.push(`/viewimage/${id}`);
          }}
        >
          <PhotoLibrarySharpIcon fontSize="large" />
        </IconButton>
      </HtmlTooltip>
    );
  }

  /*********************************************************** Render Function ********************************************** */

  return (
    <>
      {isFetchingParentImg && (
        <alert variant="warning">
          Fetching Parent Image Data or check the Image ID
        </alert>
      )}
      {!isFetchingParentImg && (
        <Container>
          {/* Showing Parent Image */}
          <Row className="justify-content-sm-center">
            <Card
              style={{
                maxWidth: window.innerWidth,
                maxHeight: window.innerHeight,
                margin: "15px",
              }}
            >
              <ImageMarker
                src={"http://localhost:8000" + parentImgURL}
                markers={markers}
                markerComponent={addMarker}
              />
            </Card>
          </Row>
          {/* Showing Agg Graphs*/}
          <Row className="justify-content-sm-center" style={{ margin: "15px" }}>
            <Col>
              <MDBContainer style={{ maxWidth: "500px", maxHeight: "100%" }}>
                <h3 className="mt-5">Aggregate Pressure Graph</h3>
                <Line
                  data={parentImg.aggDataP.dataLine}
                  options={{ responsive: true }}
                />
              </MDBContainer>
            </Col>
            <Col>
              <MDBContainer style={{ maxWidth: "500px", maxHeight: "100%" }}>
                <h3 className="mt-5">Aggregate Temperature Graph</h3>
                <Line
                  data={parentImg.aggDataT.dataLine}
                  options={{ responsive: true }}
                />
              </MDBContainer>
            </Col>
          </Row>
          <Row
            sm={1}
            className="justify-content-sm-center"
            style={{ margin: "15px" }}
          >
            {/* Printing Child Images */}
            {imgArray.map((image, i) => {
              return (
                <>
                  <Col style={{ margin: "15px" }}>
                    <Link to={`/viewimage/${image.image_id}`}>
                      <Card.Img
                        className="box"
                        variant="top"
                        src={"http://localhost:8000" + image.image}
                        style={{
                          maxHeight: "auto",
                          maxWidth: "300px",
                          minWidth: "150px",
                        }}
                      />
                    </Link>
                  </Col>
                </>
              );
            })}
          </Row>
          {/* Showing Sensors */}
          <Row style={{ marginBottom: "200px" }}>
            {senArray.map((sensor, i) => {
              return (
                <>
                  <Col xs={4} md={3}>
                    <Card
                      style={{
                        maxHeight: "300px",
                        minHeight: "auto",
                        maxWidth: "300px",
                        minWidth: "120px",
                        margin: "15px",
                      }}
                    >
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

                        <Button
                          onClick={() => {
                            handleShowGraph(sensor.sensor_id);
                          }}
                          style={{ padding: "2.5px", width: "100%" }}
                        >
                          Show Data
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              );
            })}
          </Row>
        </Container>
      )}
      {isFetching && <alert variant="warning">Fetching Data</alert>}
      {!isFetchingSensor && (
        <MyVerticallyCenteredModal
          show={mergeState.modalShow}
          onHide={() => {
            setMergeState({
              modalShow: false,
              currSensor: mergeState.currSensor,
            });
          }}
          mergeS={mergeState}
        />
      )}
    </>
  );
}
export default ViewImage;

function MyVerticallyCenteredModal(props) {
  const mergeS = props.mergeS;
  console.log("Modal loaded", mergeS);
  console.log("Array", mergeS.currSensor.values);
  var size = mergeS.currSensor.values.length;
  var temp = [];
  for (let index = 0; index < size; index++) {
    temp.push(index);
  }
  console.log("Values to be displayed", typeof mergeS.currSensor.values, size);
  var data = {
    dataLine: {
      labels: [...temp],
      datasets: [
        {
          label: `Unit: ${mergeS.currSensor.unit}`,
          fill: true,
          lineTension: 0.3,
          backgroundColor: "rgba(225, 204,230, .3)",
          borderColor: "rgb(205, 130, 158)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgb(205, 130,1 58)",
          pointBackgroundColor: "rgb(255, 255, 255)",
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(220, 220, 220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [...mergeS.currSensor.values, 0],
        },
      ],
    },
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {mergeS.currSensor.sensor_name == "pressure"
            ? "Pressure Sensor"
            : "Temperature Sensor"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDBContainer>
          <h3 className="mt-5"></h3>
          <Line data={data.dataLine} options={{ responsive: true }} />
        </MDBContainer>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="outline-danger">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
