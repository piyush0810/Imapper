import { useState, useEffect, useRef, shallowEqual } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import UploadImage from "./UploadImage";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";

function AddPImage(params) {
  const [modalUploadImg, setModalUploadImg] = useState(false);
  const [refresh, setRefresh] = useState(0);

  function handleAddImage() {
    setModalUploadImg(true);
  }

  return (
    <>
      <Container fluid="sm" style={{ padding: "50px" }}>
        <Row className="justify-content-sm-center">
          <Button
            variant="outline-primary"
            onClick={handleAddImage}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginRight: "10px",
              marginLeft: "10px",
            }}
          >
            Add Project
          </Button>
        </Row>
      </Container>
      <UploadImage
        show={modalUploadImg}
        onHide={() => {
          setModalUploadImg(false);
        }}
        pid={"-1"}
        refresh={setRefresh}
        index={-1}
      />
    </>
  );
}
export default AddPImage;
