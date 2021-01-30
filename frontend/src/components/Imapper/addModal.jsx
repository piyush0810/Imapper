import { useState, useEffect, useRef, shallowEqual } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

function AddModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload Image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>Hello</Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AddModal;
