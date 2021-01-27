import { useState, useEffect, useRef } from "react";
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
import { HorizontalBar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

function ViewImage(params) {
  console.log("Rerender");
  const { imageID } = useParams();
  const dispatch = useDispatch();
  var images = useSelector((state) => state.img);
  var sensors = useSelector((state) => state.sensor);
  // const [modalShow, setModalShow] = useState(false);
  // const [currSensor, setcurrSensor] = useState("");
  const [mergeState, setMergeState] = useState({
    modalShow: false,
    currSensor: "",
  });
  // console.log("----------------", images, sensors);
  let parentId = "";
  if (!imageID) {
    for (let key in images) {
      // console.log(images[key]);
      if (images[key].pid == "-1") {
        parentId = images[key].image_id;
        continue;
      }
      break;
    }
  } else {
    parentId = imageID;
  }
  let imgArray = [];
  for (let key in images) {
    if (images[key].pid === parentId) {
      imgArray.push(images[key]);
    }
  }
  let senArray = [];
  for (let key in sensors) {
    if (sensors[key].pid === parentId) {
      senArray.push(sensors[key]);
    }
  }
  // console.log("parent Id,", parentId);
  const [parentImg, setparentImg] = useState({ dots: [] });
  function getDataImage() {
    return (dispatch) => {
      axios.get("http://localhost:8000/image/images/").then((res) => {
        // console.log("Fetched Images Data", res.data);
        dispatch({
          type: "FETCH_IMAGES",
          payload: res.data,
        });
      });
    };
  }
  function getDataSensor() {
    return (dispatch) => {
      axios.get("http://localhost:8000/sensor/sensors/").then((res) => {
        // console.log("Fetched Sensors Data", res.data);
        dispatch({
          type: "FETCH_SENSORS",
          payload: res.data,
        });
      });
    };
  }
  useEffect(() => {
    // console.log("Fetching Data Action called");
    dispatch(getDataImage());
    dispatch(getDataSensor());
  }, []);

  useEffect(async () => {
    if (parentId) {
      // console.log("Image recieved from GET req");
      let urll = `http://localhost:8000/image/dot/${parentId}/`;
      // console.log(`sending GET req to ${urll}`);
      const resp = await axios.get(urll);
      // console.log("Dots.data", resp.data);

      // console.log("DOTS recieved", resp.data);
      //fetching Image Data from DB
      let url = `http://localhost:8000/image/${parentId}`;
      // console.log(`sending GET req to ${url}`);
      axios({
        method: "get",
        url,
      })
        .then((response) => {
          // console.log("Printing Fetched");
          // console.log(response.data[0]);

          // setdataFetched(true);
          setparentImg({
            ...parentImg,
            dots: resp.data,
            pid: response.data[0].pid,
            image: response.data[0].image,
            image_id: response.data[0].image_id,
          });
          // console.log("Image Data Set:", parentImg);
          // console.log("Done Fetching");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [parentId]);
  const moveDot = (index) => {
    console.log("This Triggers when dot clicked");
  };
  async function handleShowGraph(id) {
    console.log("Showing Model");
    console.log(id, mergeState);
    let urll = `http://localhost:8000/sensor/${id}/`;
    console.log(`sending GET req to ${urll}`);
    const resp = await axios.get(urll);
    console.log("------------Sensor Data", resp.data[0]);
    console.log("After Fetchig", mergeState);
    setMergeState({ modalShow: true, currSensor: resp.data[0] });
  }
  return (
    <>
      {parentId && (
        <Container>
          <Row>
            <Card className="bg-dark text-white">
              <Card.Img
                src={"http://localhost:8000" + parentImg.image}
                alt="Card image"
                style={{ width: "100%", height: "640" }}
              />
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
            </Card>
          </Row>

          <Row>
            {imgArray.map((image, i) => {
              return (
                <>
                  <Col xs={4} md={3}>
                    <Card>
                      <Link to={`/viewimage/${image.image_id}`}>
                        <Card.Img
                          className="box"
                          variant="top"
                          src={"http://localhost:8000" + image.image}
                          style={{ height: "auto", width: "100%" }}
                          id={`image${i.toString()}`}
                        />
                      </Link>
                    </Card>
                  </Col>
                </>
              );
            })}

            {senArray.map((sensor, i) => {
              console.log("--------------Sensor Id", sensor.sensor_id);
              return (
                <>
                  <Col xs={4} md={3}>
                    <Card style={{ width: "auto" }}>
                      <Card.Body>
                        <Card.Title>
                          {sensor.sensor_name === "temperature"
                            ? "Temperature"
                            : "Pressure"}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          Units {sensor.unit === "1" ? "celsius" : sensor.unit}
                        </Card.Subtitle>

                        <Button
                          onClick={() => {
                            handleShowGraph(sensor.sensor_id);
                          }}
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
      {!parentId && (
        <Alert variant="warning">
          No Parent Image Found Please Add from Add Image
        </Alert>
      )}
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
  var data = {
    dataHorizontal: {
      labels: [...temp],
      datasets: [
        {
          label: mergeS.currSensor.sensor_name,
          data: [...mergeS.currSensor.values],
          fill: false,
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
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
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDBContainer>
          <h3 className="mt-5">Bar chart</h3>
          <HorizontalBar
            data={data.dataHorizontal}
            options={{ responsive: true }}
          />
        </MDBContainer>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
