import React, { useState, useEffect, useRef } from "react";
import AddSensor from "../addSensor/AddSensor";
import UploadImage from "../Imapper/UploadImage";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { DeleteDot } from "../../actions/dots/dotsActions";
import axios from "axios";

export default function DotsInfo({ height, width, pid, dbDots, refresh }) {
  console.log("DotInfo: Dotsinfo Component Rendered");
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalAddSensor, setModalAddSensor] = useState(false);
  const [isAddImageClicked, setIsAddImageClicked] = useState(false);
  const [modalUploadImg, setModalUploadImg] = useState(false);
  const [isAddedImage, setisAddedImage] = useState(false);
  const [index, setIndex] = useState(-1);
  // console.log("DotInfo: Index State:", index);
  const [isDeleting, setIsDeleting] = useState(false);

  // console.log("DotInfo: Completed Rendered *Dotsinfo ");
  // function handleAddSensor(i) {
  //   // console.log("openning Modal");
  //   setModalShow(true);
  //   // console.log("Adding Index");
  //   setIndex(i);
  //   // console.log("Changed Index state");
  // }
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

    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& Enter");
    // console.log("index recieved", index);
    // console.log("setting flag ");
    // setIsDeleting(true);
    // console.log("Deleting Dots");
    // if (index < 0) {
    //   index = sizeDB + index;
    //   console.log("Index inside", index);
    //   console.log("Deleting from Server");
    //   let url = `http://localhost:8000/image/dotdel/${dots[index].dot_id}/`;
    //   // console.log("Printing Dots", dots);
    //   await axios.delete(url);
    //   // console.log("dot Deleted");
    //   console.log("Refresh called");
    //   refresh((p) => {
    //     return p + 1;
    //   });
    // } else {
    //   dispatch(DeleteDot(index));
    // }
    // setIsDeleting(false);
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& Completed");
  }

  return (
    <>
      {!isDeleting && (
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
                        <Card.Title>
                          Dot [{i}]........................
                          <Button
                            onClick={() => {
                              deleteDot(i, "local");
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
                            <Col sm={4}>
                              {dot.is_image ? " Image" : " Sensor"}
                            </Col>
                            <Col md={{ span: 4, offset: 2 }}>
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
                          <Button
                            variant="success"
                            style={{ marginLeft: "60px" }}
                            onClick={() => {
                              history.push(`/image/${dot.child_id}`);
                            }}
                          >
                            Open Image
                          </Button>
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

      <AddSensor
        onHide={() => setModalAddSensor(false)}
        pid={pid}
        index={index}
        show={modalAddSensor}
        refresh={refresh}
      />

      <UploadImage
        show={modalUploadImg}
        onHide={() => {
          setModalUploadImg(false);
        }}
        index={index}
        pid={pid}
        refresh={refresh}
      />
    </>
  );
}
