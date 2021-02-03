import { useState, useEffect, useRef, shallowEqual } from "react";
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
  /********************************************** Hooks ******************************************************** */
  const { onHide, pid, markers, refresh } = props;
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const currUser = useSelector((state) => state.curr_user);
  /********************************************** States ******************************************************** */
  const [selectedValue, setSelectedValue] = useState("s");
  const [currSensor, setCurrSensor] = useState({
    sensor_type: "",
    units: "",
  });
  const [sensors, setSensors] = useState([
    {
      sensor_type: "Temperature",
      units: "C",
      icon: null,
    },
    {
      sensor_type: "Pressure",
      units: "Atm",
      icon: null,
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [isTemp, setIsTemp] = useState(true); //default Temperature sensor
  const [isPres, setisPres] = useState(false);
  const [volume, setVolume] = useState(0);
  const [units, setunits] = useState(); //insert default value of units
  const [image, setImage] = useState({
    dots: null,
    image: null,
    image_id: "",
    pid: pid,
    image_name: "",
    username: currUser.username,
  });
  const [isFetchingSensors, setIsFetchingSensors] = useState(true);
  // console.log("AddModal: isFetchingSensor", isFetchingSensors);
  /************************************************ useEffect ***************************************************** */
  useEffect(async () => {
    setIsFetchingSensors(true);
    let url = `http://localhost:8000/sensor/csensors/`;
    const resp = await axios.get(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    // console.log("AddModal Data Reieved:", resp.data);
    setSensors([
      {
        sensor_type: "Temperature",
        units: "C",
        icon: null,
      },
      {
        sensor_type: "Pressure",
        units: "Atm",
        icon: null,
      },
      ...resp.data,
    ]);
    setIsFetchingSensors(false);
  }, [selectedValue]);
  /************************************************ Functions ***************************************************** */
  const handleSubmitSensor = async (e) => {
    setIsUploading(true);
    if (markers.length) {
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
            Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
          },
        })
        .catch((err) => console.log(err));
      const formData = new FormData();
      // console.log("Inside Submint Function", currSensor);
      formData.append("pid", pid);
      formData.append("sensor_id", gid);
      formData.append("sensor_name", currSensor.sensor_type);
      formData.append("unit", currSensor.units);
      formData.append("dimensions", volume);
      formData.append("values", []);
      formData.append("dot_id", dot_id);

      url = "http://localhost:8000/sensor/sensors/";
      const res = await axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
          },
        })
        .catch((err) => console.log(err));
      onHide();
      refresh((p) => {
        return p + 1;
      });
      setIsUploading(false);
    } else {
      console.log("addModal: No Markers provided");
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
      formData.append("image_name", image.image_name);
      formData.append("username", currUser.username);
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
      // console.log("UploadImage: Sent Post Request");
      if (markers.length) {
        // console.log("UploadImage:inside Index if");
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
              Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
            },
          })
          .catch((err) => console.log(err));
        // console.log("UploadImage: Response", resp);
        // console.log("UploadImage: Sent Dot POST Req");
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
    if (selectedValue == "s" && !isFetchingSensors) {
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
                    var name = e.target.value;
                    var unit = "";

                    for (let key in sensors) {
                      if (sensors[key].sensor_type == name) {
                        unit = sensors[key].units;
                        break;
                      }
                    }
                    setCurrSensor({ sensor_type: name, units: unit });
                  }}
                >
                  {sensors.map((sensor, i) => {
                    return (
                      <>
                        <option value={sensor.sensor_type}>
                          {sensor.sensor_type} Unit: {sensor.units}
                        </option>
                      </>
                    );
                  })}
                </Form.Control>
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
    }
  };
  const imageForm = () => {
    return (
      <Container style={{ width: "100%" }}>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Add Image Name"
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
            <Button variant="success" type="submit" onClick={handleUploadImage}>
              Upload
            </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  };
  /****************************************************** Render Function************************************************* */
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
                <GreenRadio
                  checked={selectedValue === "s"}
                  onChange={handleRadioChange}
                  value="s"
                />
              }
              label="Add Sensor"
              labelPlacement="top"
            />
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
          </RadioGroup>
          {selectedValue == "i" && imageForm()}
          {sensorForm()}
        </Formcontrol>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AddModal;
