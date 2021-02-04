import React, { useState, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function addCustomSensor() {
  /***************************************************** Hooks ************************************ */
  const imageRef = useRef(null);

  /***************************************************** UseStates ************************************ */
  const [sensor, setSensor] = useState({
    sensor_type: "",
    units: "",
    icon: "",
  });
  const [open, setOpen] = useState(false);
  const [snackMSG, setsnackMSG] = useState("");
  const [refresh, setRefresh] = useState(0);

  /***************************************************** Functions ************************************ */
  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }
  const handleChange = (e) => {
    setSensor({ ...sensor, icon: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sensor.sensor_type && sensor.units) {
      const formData = new FormData();
      formData.append("sensor_type", sensor.sensor_type);
      formData.append("units", sensor.units);
      formData.append("icon", sensor.icon);

      let url = "http://localhost:8000/sensor/csensors/";
      const resp = await axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
          },
        })
        .catch((err) => console.log(err));
      setsnackMSG("Successfully Added Sensor");
      setOpen(true);
      location.reload();
    }
  };
  /**************************************************** States **************************************/
  return (
    <>
      <Container>
        <Form>
          <Form.Group>
            <Form.Label>Enter type of Sensor</Form.Label>
            <Form.Control
              type="text"
              placeholder="eg pressure"
              onChange={(e) => {
                setSensor({ ...sensor, sensor_type: e.target.value });
              }}
            />
            <Form.Text className="text-muted">maximum 50 characters</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Enter unit of Sensor</Form.Label>
            <Form.Control
              type="text"
              placeholder="eg C"
              onChange={(e) => {
                setSensor({ ...sensor, units: e.target.value });
              }}
            />
          </Form.Group>
          <Form.File label="Icon" onChange={handleChange} ref={imageRef} />
          <br />
          <Button
            variant="outline-primary"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form>
      </Container>
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

export default addCustomSensor;
