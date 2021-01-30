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
  FormLabel,
  FormControl,
} from "react-bootstrap";
import Radio from "@material-ui/core/Radio";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { FormControl as Formcontrol } from "@material-ui/core";

const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

function AddModal(props) {
  const { onHide, pid, markers, refresh } = props;
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const dots = useSelector((state) => state.dot.dots);
  /********************************************** States ******************************************************** */
  const [selectedValue, setSelectedValue] = useState("i");
  const [isUploading, setIsUploading] = useState(false);
  const [isTemp, setIsTemp] = useState(true); //default Temperature sensor
  const [isPres, setisPres] = useState(false);
  const [volume, setVolume] = useState(0);
  const [unit, setunit] = useState("C"); //insert default value of unit
  const [image, setImage] = useState({
    dots: null,
    image: null,
    image_id: "",
    pid: pid,
  });
  console.log(image);
  /************************************************ Functions ***************************************************** */
  function getDotID(index) {
    return dots[index].dot_id;
  }
  const handleSubmitSensor = async (e) => {
    // console.log("AddSensor: Submiting Flag changed");
    setIsUploading(true);
    if (markers.length) {
      console.log("AddSensor: Markers Recieved", markers);
      // Making Id's for dot and sensor
      const dot_id = (
        Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      ).toUpperCase();
      const gid = (
        Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      ).toUpperCase();
      var mark = markers.pop();
      const formDotData = new FormData();
      formDotData.append("dot_id", dot_id);
      formDotData.append("parent_id", pid);
      formDotData.append("x", Math.round(mark.top));
      formDotData.append("y", Math.round(mark.left));
      formDotData.append("is_sensor", true);
      formDotData.append("is_image", false);
      formDotData.append("child_id", gid);

      let url = `http://localhost:8000/image/dot/${pid}/`;
      const resp = await axios
        .post(url, formDotData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "",
          },
        })
        .catch((err) => console.log(err));

      console.log("AddSensor: Sent Dot POST Req");

      const formData = new FormData();

      if (isTemp) {
        switch (unit) {
          case "1":
        }
      }
      formData.append("pid", pid);
      formData.append("sensor_id", gid);
      formData.append("sensor_name", isTemp ? "temperature" : "pressure");
      formData.append("unit", unit);
      formData.append("dimensions", volume);
      formData.append("values", []);
      formData.append("dot_id", dot_id);

      url = "http://localhost:8000/sensor/sensors/";
      const res = await axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "",
          },
        })
        .catch((err) => console.log(err));
      console.log("AddSensor: Sent Sensor POST Req");
      onHide();
      console.log("AddSensor: Called Refresh Image Component");
      refresh((p) => {
        return p + 1;
      });
      setIsUploading(false);
    } else {
      console.log("AddSensor: No Markers provided");
    }
  };
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
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
  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (image.image) {
      const formData = new FormData();
      formData.append("image", image.image);
      formData.append("dots", image.dots);
      formData.append("image_id", image.image_id);
      formData.append("pid", image.pid);
      // console.log("PId in FromData", image.pid);
      let url = "http://localhost:8000/image/images/";
      const resp = await axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .catch((err) => console.log(err));
      console.log("UploadImage: Sent Post Request");
      if (markers.length) {
        console.log("UploadImage:inside Index if");
        const formDotData = new FormData();
        // Making Id's for dot and sensor
        const dot_id = (
          Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        ).toUpperCase();
        var mark = markers.pop();
        formDotData.append("dot_id", dot_id);
        formDotData.append("parent_id", pid);
        formDotData.append("x", Math.round(mark.top));
        formDotData.append("y", Math.round(mark.left));
        formDotData.append("is_sensor", false);
        formDotData.append("is_image", true);
        formDotData.append("child_id", image.image_id);
        let url = `http://localhost:8000/image/dot/${pid}/`;
        const resp = await axios
          .post(url, formDotData, {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: "",
            },
          })
          .catch((err) => console.log(err));
        console.log("UploadImage: Response", resp);
        console.log("UploadImage: Sent Dot POST Req");
      } else {
        console.log("No Markers present");
      }
      refresh((p) => {
        return p + 1;
      });
      onHide();
    } else {
      ("No Image Selected");
    }
  };

  /******************************************************* Forms ***************************************************** */
  const sensorForm = () => {
    return (
      <>
        {isUploading && (
          <Alert variant="warning">Sensor Data being Uploaded</Alert>
        )}
        {!isUploading && (
          <Form onSubmit={handleSubmitSensor}>
            <Form.Group>
              <Form.Label>Select Type of Sensor</Form.Label>
              <Form.Control
                required
                as="select"
                onChange={(e) => {
                  // console.log("Value Changed", e.target.value);
                  if (e.target.value === "1") {
                    setIsTemp(true);
                    setisPres(false);
                  } else if (e.target.value === "2") {
                    setisPres(true);
                    setIsTemp(false);
                    // console.log("Is Pressure Changed", isTemp, isPres);
                  }
                }}
              >
                <option value="1">Temperature</option>
                <option value="2">Pressure</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <FormLabel>Select Units</FormLabel>
              {isTemp && (
                <FormControl
                  required
                  as="select"
                  onChange={(e) => {
                    // console.log("Temperature Unit Selected", e.target.value);
                    console.log(e.target.value);
                    setunit(e.target.value);
                  }}
                >
                  <option value="C">Celsius (C)</option>
                  <option value="K">Kelvin (K)</option>
                  <option value="F">Fahrenheit (F)</option>
                </FormControl>
              )}
              {isPres && (
                <FormControl
                  required
                  as="select"
                  onChange={(e) => {
                    // console.log("Pressure Unit Selected", e.target.value);
                    setunit(e.target.value);
                  }}
                >
                  <option value="Pa">Pascal (Pa)</option>
                  <option value="bar">Bar (bar)</option>
                  <option value="atm"> Atm (atm)</option>
                </FormControl>
              )}
            </Form.Group>
            <Form.Group controlId="sensorVolume">
              <Form.Label>
                Volume(m<sup>3</sup>)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter volume"
                required
                onChange={(e) => {
                  setVolume(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="outline-success" type="submit">
              Add Sensor
            </Button>
          </Form>
        )}
      </>
    );
  };
  const imageForm = () => {
    return (
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
            <Button variant="success" type="submit" onClick={handleUploadImage}>
              Upload
            </Button>
          </Form.Group>
        </Form>
      </Container>
    );
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
          Choose what to add?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formcontrol component="fieldset">
          <RadioGroup
            row
            row
            aria-label="position"
            name="position"
            defaultValue="top"
          >
            <FormControlLabel
              value="top"
              control={
                <Radio
                  checked={selectedValue === "i"}
                  onChange={handleRadioChange}
                  value="i"
                />
              }
              label="Add Image"
              labelPlacement="top"
            />
            <FormControlLabel
              value="top"
              control={
                <GreenRadio
                  checked={selectedValue === "s"}
                  onChange={handleRadioChange}
                  value="s"
                />
              }
              label="Add Sensor"
              labelPlacement="top"
            />
          </RadioGroup>
          {selectedValue == "i" && imageForm()}
          {selectedValue == "s" && sensorForm()}
        </Formcontrol>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AddModal;
