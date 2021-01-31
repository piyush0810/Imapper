import { useState, useEffect, useRef, shallowEqual } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";
import Dot from "../dots/Dot";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

function ViewImage(params) {
  console.log("ViewImage: View Compnent rendered");
  const { imageID } = useParams();
  const dispatch = useDispatch();
  var images = useSelector((state) => {
    // console.log("UseSelect for Images Called");
    return state.img;
  }, shallowEqual);
  var sensors = useSelector((state) => {
    // console.log("UseSelect for Sensors Called");
    return state.sensor;
  }, shallowEqual);
  console.log("ViewImage: Images From Store", images);
  console.log("ViewImage: Sensors From Store", sensors);
  let parentId = "";
  var parentImgURL = "";
  let imgArray = [];
  let senArray = [];
  const [mergeState, setMergeState] = useState({
    modalShow: false,
    currSensor: "",
  });
  console.log("ViewImage: MergeState State:", mergeState);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingParentImg, setisFetchingParentImg] = useState(true);
  const [isFetchingSensor, setIsFetchingSensor] = useState(true);
  const [parentImg, setparentImg] = useState();
  console.log("ViewImage: Parent Image State:", parentImg);

  // console.log("----------------", images, sensors);
  if (!imageID) {
    if (!isFetching) {
      //if this is parent image and data has been fetched
      // console.log("Geting Parent ID from Images");
      for (let key in images) {
        // console.log(images[key]);
        if (images[key].pid == "-1") {
          parentId = images[key].image_id;
          continue;
        }
        break;
      }
    }
  } else {
    // console.log("Recieved Parent ID from URL");
    parentId = imageID;
  }
  if (parentId) {
    // console.log("parent Id,", parentId);
    if (!isFetching) {
      // console.log("Getting Parent Images and Sensors");
      for (let key in images) {
        if (images[key].pid === parentId) {
          imgArray.push(images[key]);
        }
        if (images[key].image_id == parentId) {
          //this is the parent Image
          parentImgURL = images[key].image;
        }
      }
      // console.log("Parent ImG URL:", parentImgURL);
      for (let key in sensors) {
        if (sensors[key].pid === parentId) {
          senArray.push(sensors[key]);
        }
      }
      console.log("ViewImage: Images:", imgArray);
      console.log("ViewImage: Sensors:", senArray);
    }
  }

  console.log("ViewImage: Component Completed Rendered");

  useEffect(async () => {
    // console.log("##################Fetching Data Action called");

    // console.log("Setting Flag to true for Fetching");
    setIsFetching(true);
    let url = "http://localhost:8000/sensor/sensors/";
    // console.log("Sending GET Req for Sensors to", url);
    const resp = await axios.get(url);
    // console.log("Recieved Sensor data", resp.data);
    // console.log("Dispatching Sensors");
    dispatch({
      type: "FETCH_SENSORS",
      payload: resp.data,
    });
    // console.log("Done Dispatching Sensors");
    url = "http://localhost:8000/image/images/";
    // console.log("Sending GET Req for Images to", url);
    const res = await axios.get(url);
    // console.log("Recieved Image data", res.data);
    // console.log("Dispatching Images");
    dispatch({
      type: "FETCH_IMAGES",
      payload: res.data,
    });
    // console.log("Done Dispatching Images");
    // console.log("##################Fetching is Done");

    setIsFetching(false);
  }, []);

  useEffect(async () => {
    // console.log("------------------Fetching Parent Image Data");

    if (parentId) {
      // console.log("Setting Flag for Fetching parent Image");
      setisFetchingParentImg(true);
      // console.log("Parent ID Recieved", parentId);
      let url = `http://localhost:8000/image/dot/${parentId}/`;
      // console.log(`sending GET req to Fetch Dots`, url);
      const resp = await axios.get(url);
      // console.log("Parent Dots  Data Recieved", resp.data);
      url = `http://localhost:8000/image/${parentId}`;
      // console.log(`sending GET req to Fetch Parent Image Data`, url);
      const res = await axios.get(url);
      console.log("Parent Image  Data Recieved", res.data);
      // console.log("Setting Parent iamge Data into state");
      url = `http://localhost:8000/image/value/${parentId}/pressure`;
      const ressP = await axios.get(url);
      url = `http://localhost:8000/image/value/${parentId}/temperature`;
      const ressT = await axios.get(url);
      console.log("ViewImage: Agg DataP", ressP.data);
      console.log("ViewImage: Agg DataT", ressT.data);
      var sizeP = ressP.data.length;
      var tempP = [];
      var sizeT = ressT.data.length;
      var tempT = [];
      // console.log("Viewimage: Size", sizeP);
      for (let index = 0; index < sizeP; index++) {
        tempP.push(index.toString());
      }
      for (let index = 0; index < sizeT; index++) {
        tempT.push(index.toString());
      }
      var dataP = {
        dataLine: {
          labels: [...tempP],
          datasets: [
            {
              label: "Unit: Atm",
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
              data: [...ressP.data, 0],
            },
          ],
        },
      };
      var dataT = {
        dataLine: {
          labels: [...tempT],
          datasets: [
            {
              label: "Unit: Celsius",
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
              data: [...ressT.data, 0],
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
        setisFetchingParentImg(false);
      }
      // console.log("Done Setting Parent Image Data");
    } else {
      // console.log("Parent ID Not Defined");
    }
    // console.log("------------------Done fetching Parent Image");
  }, [parentId]);

  const moveDot = (index) => {
    console.log("This Triggers when dot clicked");
  };
  async function handleShowGraph(id) {
    setIsFetchingSensor(true);
    console.log(
      "-----------------------------------------Fetching Sensor Data"
    );
    console.log("Sensor ID recieved", id);
    let urll = `http://localhost:8000/sensor/${id}/`;
    console.log(`sending GET req to ${urll}`);
    const resp = await axios.get(urll);
    console.log("Sensor Data recieved", resp.data[0]);
    console.log("Saving merge State");
    setMergeState({ modalShow: true, currSensor: resp.data[0] });
    setIsFetchingSensor(false);
    console.log(
      "-----------------------------------------Completed Fetching of Sensor Data"
    );
  }
  return (
    <>
      {isFetchingParentImg && (
        <Alert variant="warning">
          Fetching Parent Image Data or check the Image ID
        </Alert>
      )}
      {!isFetchingParentImg && (
        <Container fluid>
          <Row className="justify-content-sm-center" style={{ margin: "15px" }}>
            <Card className="bg-dark text-white">
              <Card.Img
                src={"http://localhost:8000" + parentImgURL}
                alt="Card image"
                style={{ width: "640px", height: "480px", padding: "5px" }}
              />
              {!isFetchingParentImg && (
                <section>
                  {parentImg.dots.map((dot, i) => {
                    return (
                      <>
                        <Dot
                          x={dot.x}
                          y={dot.y}
                          i={i}
                          styles={{
                            backgroundColor: "red",
                            boxShadow: "0 2px 4px gray",
                          }}
                          dotRadius={6}
                          moveDot={moveDot}
                        />
                      </>
                    );
                  })}
                </section>
              )}
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
      {isFetching && <Alert variant="warning">Fetching Data</Alert>}
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
