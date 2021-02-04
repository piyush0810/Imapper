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
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function UploadImage(props) {
  console.log("UplaodImage: Component Rendered");
  const dots = useSelector((state) => state.dot.dots);
  const currUser = useSelector((state) => state.curr_user);
  const dispatch = useDispatch();
  const pid = props.pid;
  const index = props.index;
  const imageRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [snackMSG, setsnackMSG] = useState("");
  const [image, setImage] = useState({
    dots: null,
    image: null,
    image_id: "",
    pid: pid,
    image_name: "",
    username: currUser.username,
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
      formData.append("image_name", image.image_name);
      formData.append("username", image.username);

      // console.log("PId in FromData", image.pid);
      let url = "http://localhost:8000/image/images/";
      const resp = await axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
          },
        })
        .catch((err) => console.log(err));
      console.log("UploadImage: Sent Post Request");
      props.onHide();
      setsnackMSG("Successfully Added Site");
      setOpen(true);
      props.refresh((p) => {
        return p + 1;
      });
    } else {
      ("No Image Selected");
    }
  };
  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }
  return (
    <>
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
                <Form.Control
                  type="text"
                  placeholder="Add Project Name"
                  required
                  onChange={(e) => {
                    setImage({
                      ...image,
                      image_name: e.target.value,
                    });
                  }}
                />
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
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackMSG}
        </Alert>
      </Snackbar>
    </>
  );
}
export default UploadImage;
