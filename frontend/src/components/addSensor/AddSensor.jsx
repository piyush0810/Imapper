import React, { useState } from "react";
import { Form, Button, FormLabel, FormControl, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";
import { Modal } from "react-bootstrap";
import axios from "axios";

function AddSensor(props) {
  console.log("addSensor Componen t Rendered");
  const { onHide, pid, index, show, refresh } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [isTemp, setIsTemp] = useState(true); //default Temperature sensor
  const [isPres, setisPres] = useState(false);
  const [volume, setVolume] = useState(0);
  const [unit, setunit] = useState("1"); //insert default value of unit
  const dots = useSelector((state) => state.dot.dots);
  const dispatch = useDispatch();

  function getDotID(index) {
    return dots[index].dot_id;
  }
  const handleSubmit = async (e) => {
    console.log("Submiting Flag changed");
    setIsUploading(true);
    if (index >= 0) {
      let dotID = getDotID(index);
      const gid = (
        Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      ).toUpperCase();

      const formDotData = new FormData();
      formDotData.append("dot_id", dots[index].dot_id);
      formDotData.append("parent_id", dots[index].parent_id);
      formDotData.append("x", dots[index].x);
      formDotData.append("y", dots[index].y);
      formDotData.append("is_sensor", true);
      //action for bool
      formDotData.append("is_image", false);
      formDotData.append("child_id", gid);
      let url = `http://localhost:8000/image/dot/${dots[index].parent_id}/`;
      dispatch(DeleteDot(index));
      const resp = await axios
        .post(url, formDotData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "",
          },
        })
        .catch((err) => console.log(err));

      console.log("Sent Dot POST Req");

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
      formData.append("dot_id", dotID);

      url = "http://localhost:8000/sensor/sensors/";
      const res = await axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "",
          },
        })
        .catch((err) => console.log(err));
      console.log("Sent Sensor POST Req");
      onHide();
      refresh((p) => {
        return p + 1;
      });

      setIsUploading(false);
    } else {
      console.log("index is -ve");
    }
  };
  return (
    <>
      {isUploading && (
        <Alert variant="warning">Sensor Data being Uploaded</Alert>
      )}
      {!isUploading && (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Sensor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddSensor
              onHide={props.onHide}
              pid={props.pid}
              index={props.index}
            />
            <Form onSubmit={handleSubmit}>
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

              <Button variant="primary" type="submit">
                Add Sensor
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default AddSensor;
