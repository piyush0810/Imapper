import React, { useState } from "react";
import { Form, Button, FormLabel, FormControl } from "react-bootstrap";
function AddSensor({ onHide }) {
  const [isTemp, setIsTemp] = useState(true); //default Temperature sensor
  const [isPres, setisPres] = useState(false);
  const [unit, setunit] = useState("1"); //insert default value of unit
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submiting Sensor request");
    onHide();
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Select Type of Sensor</Form.Label>
        <Form.Control
          required
          as="select"
          onChange={(e) => {
            console.log("Value Changed", e.target.value);
            if (e.target.value === "1") {
              setIsTemp(true);
              setisPres(false);
            } else if (e.target.value === "2") {
              setisPres(true);
              setIsTemp(false);
              console.log("Is Pressure Changed", isTemp, isPres);
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
              console.log("Temperature Unit Selected", e.target.value);
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
              console.log("Pressure Unit Selected", e.target.value);
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
        <Form.Control type="number" placeholder="Enter volume" required />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Sensor
      </Button>
    </Form>
  );
}
export default AddSensor;
