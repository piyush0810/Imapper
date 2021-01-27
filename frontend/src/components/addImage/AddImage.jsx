import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

function AddImage({ pid, index, hideButton }) {
  console.log(
    "#########################################AddImage Component Rendered"
  );
  const imageRef = useRef(null);
  const history = useHistory();
  const dots = useSelector((state) => state.dot.dots);

  const [image, setImage] = useState({
    dots: null,
    image: null,
    image_id: "",
    pid: pid ? pid : "-1",
  });
  console.log("Image State:", image);
  const [isUpload, setIsUpload] = useState(false);
  console.log(
    "######################################### Cmpleted Rendered AddImage"
  );
  const handleChange = (e) => {
    const gid = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();
    // console.log("Image State Changed");
    setImage({ ...image, image: e.target.files[0], image_id: gid });
  };

  const handleDelete = (e) => {
    // console.log("Image Ref is changed");
    imageRef.current.value = "";
    // console.log("Image State Changed");
    setImage({ ...image, image: null, image_id: "" });
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (image.image) {
      // if (index >= 0) {
      //   console.log("inside Index if");
      //   const formDotData = new FormData();
      //   formDotData.append("dot_id", dots[index].dot_id);
      //   formDotData.append("parent_id", dots[index].parent_id);
      //   formDotData.append("x", dots[index].x);
      //   formDotData.append("y", dots[index].y);
      //   formDotData.append("is_sensor", false);
      //   //action for bool
      //   formDotData.append("is_image", true);
      //   formDotData.append("child_id", image.image_id);
      //   let url = `http://localhost:8000/image/dot/${dots[index].parent_id}/`;
      //   const resp = await axios
      //     .post(url, formDotData, {
      //       headers: {
      //         "content-type": "multipart/form-data",
      //         Authorization: "",
      //       },
      //     })
      //     .catch((err) => console.log(err));
      //   console.log("Response", resp);
      //   console.log("Sent Dot POST Req");
      // }

      const formData = new FormData();
      formData.append("image", image.image);
      formData.append("dots", image.dots);
      formData.append("image_id", image.image_id);
      formData.append("pid", image.pid);
      // console.log("PId in FromData", image.pid);
      let url = "http://localhost:8000/image/images/";
      axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("Image Sucessfully Uploaded");
          setIsUpload(true);
          // if (pid) {
          //   hideButton(true);
          // }
          //history.push();
          console.log("Changing Route");

          history.push(`/image/${image.image_id}`);
        })
        .catch((err) => console.log(err));
    } else {
      console.log("No File In Input");
    }
  };

  return (
    <div>
      {!isUpload && (
        <>
          <Container>
            <Form>
              <Form.Group>
                <Form.File
                  label="Upload Image"
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
        </>
      )}
    </div>
  );
}

export default AddImage;
