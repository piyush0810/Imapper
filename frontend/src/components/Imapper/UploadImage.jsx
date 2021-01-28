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
  Form,
} from "react-bootstrap";

function UploadImage(props) {
  console.log("UplaodImage: Component Rendered");
  const pid = props.pid;
  const imageRef = useRef(null);

  const [image, setImage] = useState({
    dots: null,
    image: null,
    image_id: "",
    pid: pid,
  });
  console.log("UploadImage: image State", image);
  console.log("UploadImage: Component Ended");

  /* Functions */
  const handleChange = (e) => {
    const gid = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();
    setImage({ ...image, image: e.target.files[0], image_id: gid });
  };
  const handleDelete = (e) => {
    imageRef.current.value = "";
    setImage({ ...image, image: null, image_id: "" });
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (image.image) {
      const formData = new FormData();
      formData.append("image", image.image);
      formData.append("dots", image.dots);
      formData.append("image_id", image.image_id);
      formData.append("pid", image.pid);
      // console.log("PId in FromData", image.pid);
      let url = "http://localhost:8000/image/images/";
      const resp = await axios.post(url, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      console.log("UploadImage: Sent Post Request");
      props.onHide();
      props.refresh((p) => {
        return p + 1;
      });
    } else {
      ("No Image Selected");
    }
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
          Upload Image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Form.Group>
              <Form.File
                label="JPEG/JPG"
                onChange={handleChange}
                ref={imageRef}
              />
              <br />
              <Button onClick={handleDelete} variant="danger">
                Delete
              </Button>
              <Button variant="success" type="submit" onClick={handleUpload}>
                Upload
              </Button>
            </Form.Group>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default UploadImage;
