import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AddSensor from "../addSensor/AddSensor";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";
import AddImage from "../addImage/AddImage";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";

export default function DotsInfo({ height, width, pid, Dots }) {
  console.log("Dotsinfo Component Rendered");
  console.log("Prining dots from Param in DotsInfo", Dots);
  var dots = useSelector((state) => {
    // console.log("inside useSelector", state.dot.dots);
    return state.dot.dots;
  });
  // console.log("Returned State", dots);
  var myDots = [];
  dots.forEach(function (dot) {
    console.log(dot);
    if (dot.parent_id == pid) {
      myDots.push(dot);
    }
  });
  dots = [...Dots, ...myDots];

  // myDots = [...Dots, ...myDots];
  console.log("final Dots", dots);
  // useEffect(() => {
  //   var myDots = [];
  //   for (let dot in dots) {
  //     if (dot.parent_id == pid) {
  //       myDots.push(dot);
  //     }
  //   }
  //   dots = [...Dots, ...myDots];
  // }, [dots]);
  // console.log("Image Add request from", pid);
  const [modalShow, setModalShow] = React.useState(false);
  const [isAddSensorClicked, setIsAddSensorClicked] = useState(false);
  const [isAddImageClicked, setIsAddImageClicked] = useState(false);
  const [isAddedImage, setisAddedImage] = useState(false);
  const [index, setIndex] = useState(-1);
  const [isAddedSensor, setisAddedSensor] = useState(false);
  const dispatch = useDispatch();
  function handleAddSensor(i) {
    setModalShow(true);
    setIndex(i);
  }
  function handleAddImage(i) {
    setIndex(i);
  }
  function deleteDot(index) {
    dispatch(DeleteDot(index));
  }

  return (
    <>
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
                            deleteDot(i - Dots.length);
                          }}
                          variant="danger"
                        >
                          Remove
                        </Button>
                      </Card.Title>

                      <Card.Text>
                        Coordinates: x: {dot.x}, y: {dot.y}
                      </Card.Text>

                      <Row>
                        {!dot.is_sensor && (
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
                        )}
                        {!dot.is_image && (
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
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            );
          })}
        </Row>
      </Container>

      {isAddSensorClicked && (
        <AddSensor
          onHide={() => setModalShow(false)}
          pid={pid}
          index={index}
          show={modalShow}
          hideButton={setisAddedSensor}
        />
      )}
      {isAddImageClicked && (
        <AddImage pid={pid} index={index} hideButton={setisAddedImage} />
      )}
    </>
  );
}
