import React, { useState, useEffect, useRef } from "react";
import AddSensor from "../addSensor/AddSensor";
import UploadImage from "../Imapper/UploadImage";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { DeleteDot } from "../../actions/dots/dotsActions";
import axios from "axios";

export default function DotsInfo({ height, width, pid, dbDots, refresh }) {
  console.log("DotInfo: Dotsinfo Component Rendered");
  const dispatch = useDispatch();
  var images = useSelector((state) => state.img);
  var sensors = useSelector((state) => state.sensor);

  console.log("DotInfo:images Selector", images);
  console.log("DotInfo:sensors Selectors", sensors);
  const [modalAddSensor, setModalAddSensor] = useState(false);
  const [modalUploadImg, setModalUploadImg] = useState(false);
  const [index, setIndex] = useState(-1);
  // console.log("DotInfo: Index State:", index);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  var canRender = !isDeleting && !isFetching;
  var localDots = useSelector((state) => {
    return state.dot.dots;
  });
  var myLocalDots = [];
  console.log("DotInfo: Dots From DB", dbDots);
  console.log("DotInfo: Dots from useState", localDots);

  localDots.forEach(function (dot) {
    if (dot.parent_id == pid) {
      myLocalDots.push(dot);
    }
  });
  console.log("DotInfo: MyLocalDots", myLocalDots);

  async function deleteDot(index, type) {
    console.log("DotInfo: DeleteDot called");
    setIsDeleting(true);
    if (type == "local") {
      console.log("DotInfo:Local Dot Deleted");
      dispatch(DeleteDot(index));
    } else {
      let url = `http://localhost:8000/image/dotdel/${index}/`;
      console.log("DotInfo: Database Dot called");
      await axios.delete(url);
      console.log("DotsInfo: Refreshcalled");
      refresh((p) => {
        return p + 1;
      });
    }
    setIsDeleting(false);
  }
  useEffect(async () => {
    setIsFetching(true);
    let url = "http://localhost:8000/image/images/";
    const res = await axios.get(url);
    dispatch({
      type: "FETCH_IMAGES",
      payload: res.data,
    });
    url = "http://localhost:8000/sensor/sensors/";
    const resp = await axios.get(url);
    dispatch({
      type: "FETCH_SENSORS",
      payload: resp.data,
    });
    setIsFetching(false);
  }, []);
  function getImageURL(id) {
    for (let key in images) {
      if (images[key].image_id == id) {
        return images[key].image;
      }
    }
    return "";
  }
  function getSensorName(id) {
    for (let key in sensors) {
      if (sensors[key].sensor_id == id) {
        return sensors[key].sensor_name == "pressure"
          ? "Pressure"
          : "Temperature";
      }
    }
    return "";
  }
  function getSensorUnit(id) {
    for (let key in sensors) {
      if (sensors[key].sensor_id == id) {
        return `Unit: ${sensors[key].unit}`;
      }
    }
    return "";
  }
  return (
    <>
      {!canRender && <Alert variant="warning">Fetching Data Please Wait</Alert>}
      {canRender && (
        <Container fluid>
          <Row
            md={6}
            sm={1}
            lg={6}
            noGutters
            className="justify-content-sm-center"
          >
            {myLocalDots.map((dot, i) => {
              return (
                <>
                  <Col style={{ margin: "10px" }}>
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title
                          style={{ marginLeft: "5px", marginTop: "5px" }}
                        >
                          Dot [{i}]
                          <Button
                            style={{ marginLeft: "115px", marginTop: "5px" }}
                            onClick={() => {
                              deleteDot(i, "local");
                            }}
                            variant="outline-danger"
                          >
                            Remove
                          </Button>
                        </Card.Title>

                        <Card.Text style={{ margin: "15px" }}>
                          Coordinates: x: {dot.x}, y: {dot.y}
                        </Card.Text>

                        {!dot.child_id && (
                          <Row>
                            <Col>
                              <Button
                                style={{ margin: "5px" }}
                                onClick={() => {
                                  setModalAddSensor(true);
                                  setIndex(i);
                                }}
                                variant="outline-primary"
                              >
                                Add Sensor
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                style={{ margin: "5px" }}
                                onClick={() => {
                                  setModalUploadImg(true);
                                  setIndex(i);
                                }}
                                variant="outline-success"
                              >
                                Add Image
                              </Button>
                            </Col>
                          </Row>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              );
            })}
          </Row>
          <Row lg={4} sm={1} noGutters className="justify-content-sm-center">
            {dbDots.map((dot, i) => {
              return (
                <>
                  <Col style={{ margin: "10px" }}>
                    <Card style={{ width: "250px" }}>
                      <Card.Body>
                        <Card.Title>
                          <Row style={{ margin: "5px" }}>
                            <Col>{dot.is_image ? " Image" : " Sensor"}</Col>
                            <Col>
                              <Button
                                onClick={() => {
                                  deleteDot(dot.dot_id, "db");
                                }}
                                variant="danger"
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        </Card.Title>
                        {dot.is_image && (
                          <Link to={`/image/${dot.child_id}`}>
                            <Card.Img
                              className="box "
                              src={
                                "http://localhost:8000" +
                                getImageURL(dot.child_id)
                              }
                              style={{
                                padding: "5px",
                                maxHeight: "auto",
                                maxWidth: "100%",
                                minWidth: "150px",
                              }}
                              alt="Image Not Available"
                            />
                          </Link>
                        )}
                        {dot.is_sensor && (
                          <Card.Text style={{ margin: "10px" }}>
                            {getSensorName(dot.child_id)} <br />
                            {getSensorUnit(dot.child_id)}
                          </Card.Text>
                        )}
                        <Card.Text style={{ margin: "10px" }}>
                          Coordinates: x: {dot.x}, y: {dot.y}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              );
            })}
          </Row>
        </Container>
      )}
      {modalAddSensor && (
        <AddSensor
          onHide={() => setModalAddSensor(false)}
          pid={pid}
          index={index}
          show={modalAddSensor}
          refresh={refresh}
        />
      )}
      {modalUploadImg && (
        <UploadImage
          show={modalUploadImg}
          onHide={() => {
            setModalUploadImg(false);
          }}
          index={index}
          pid={pid}
          refresh={refresh}
        />
      )}
    </>
  );
}
