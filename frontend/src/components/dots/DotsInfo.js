import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AddSensor from "../addSensor/AddSensor";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";
import AddImage from "../addImage/AddImage";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import axios from "axios";

export default function DotsInfo({ height, width, pid, Dots, refresh }) {
  console.log("**************************Dotsinfo Component Rendered");
  const dispatch = useDispatch();
  var dots = useSelector((state) => {
    // console.log("inside useSelector", state.dot.dots);
    return state.dot.dots;
  });
  console.log("Dots From DB", Dots);
  console.log("Dots from useState", dots);
  var myDots = [];
  dots.forEach(function (dot) {
    if (dot.parent_id == pid) {
      myDots.push(dot);
    }
  });
  dots = [...Dots, ...myDots];
  console.log("final Dots", dots);

  const [modalShow, setModalShow] = useState(false);
  const [isAddSensorClicked, setIsAddSensorClicked] = useState(false);
  const [isAddImageClicked, setIsAddImageClicked] = useState(false);
  const [isAddedImage, setisAddedImage] = useState(false);
  const [index, setIndex] = useState(-1);
  console.log("Index State:", index);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log("*************************Completed Rendered *Dotsinfo ");
  function handleAddSensor(i) {
    // console.log("openning Modal");
    setModalShow(true);
    // console.log("Adding Index");
    setIndex(i);
    // console.log("Changed Index state");
  }
  function handleAddImage(i) {
    setIndex(i);
  }
  async function deleteDot(index, sizeDB) {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& Enter");
    console.log("index recieved", index);
    console.log("setting flag ");
    setIsDeleting(true);
    console.log("Deleting Dots");
    if (index < 0) {
      index = sizeDB + index;
      console.log("Index inside", index);
      console.log("Deleting from Server");
      let url = `http://localhost:8000/image/dotdel/${dots[index].dot_id}/`;
      // console.log("Printing Dots", dots);
      await axios.delete(url);
      // console.log("dot Deleted");
      console.log("Refresh called");
      refresh((p) => {
        return p + 1;
      });
    } else {
      dispatch(DeleteDot(index));
    }
    setIsDeleting(false);

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& Completed");
  }

  return (
    <>
      {!isDeleting && (
        <Container>
          <Row xs={4} md={3} noGutters>
            {dots.map((dot, i) => {
              return (
                <>
                  <Col>
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title>
                          Dot [{i}]........................
                          <Button
                            onClick={() => {
                              deleteDot(i - Dots.length, Dots.length);
                            }}
                            variant="danger"
                          >
                            Remove
                          </Button>
                        </Card.Title>

                        <Card.Text>
                          Coordinates: x: {dot.x}, y: {dot.y}
                        </Card.Text>

                        {!dot.child_id && (
                          <Row>
                            <Col>
                              <Button
                                onClick={() => {
                                  setIsAddSensorClicked(true);
                                  handleAddSensor(i - Dots.length);
                                }}
                                variant="outline-primary"
                              >
                                Add Sensor
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={() => {
                                  setIsAddImageClicked(true);
                                  handleAddImage(i - Dots.length);
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
        </Container>
      )}
      {isAddSensorClicked && (
        <AddSensor
          onHide={() => setModalShow(false)}
          pid={pid}
          index={index}
          show={modalShow}
          refresh={refresh}
        />
      )}
      {isAddImageClicked && (
        <AddImage pid={pid} index={index} refresh={refresh} />
      )}
    </>
  );
}
