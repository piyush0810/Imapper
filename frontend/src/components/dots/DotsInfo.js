import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AddSensor from "../addSensor/AddSensor";
import { Button, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";

export default function DotsInfo({ height, width, pid }) {
  console.log("Dotsinfo Component Rendered");
  console.log("Image Add request from", pid);
  const [modalShow, setModalShow] = React.useState(false);
  const dots = useSelector((state) => state.dot.dots);
  const dispatch = useDispatch();

  function deleteDot(index) {
    dispatch(DeleteDot(index));
  }
  return (
    <>
      <ul>
        {dots.map((dot, i) => {
          return (
            <>
              <li>
                <p>
                  Dot {i}{" "}
                  <button
                    onClick={() => {
                      deleteDot(i);
                    }}
                  >
                    Remove
                  </button>
                </p>
                <p>
                  Coordinates: x: {dot.x}, y: {dot.y}
                </p>
                <button onClick={() => setModalShow(true)}>Add Sensor</button>
                <Link to={`/addimage/${pid}`}>
                  <button>Add Image</button>
                </Link>
              </li>
            </>
          );
        })}
      </ul>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      ;
    </>
  );
}

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Sensor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddSensor onHide={props.onHide} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
