import React, { useState } from "react";
import { Form, Button, FormLabel, FormControl, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";
import { Modal } from "react-bootstrap";
import axios from "axios";

function AddSensor(props) {
  console.log("AddSensor: addSensor Componen t Rendered");
  const { onHide, pid, index, show, refresh } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [isTemp, setIsTemp] = useState(true); //default Temperature sensor
  const [isPres, setisPres] = useState(false);
  const [volume, setVolume] = useState(0);
  const [unit, setunit] = useState("C"); //insert default value of unit
  const dots = useSelector((state) => state.dot.dots);
  const dispatch = useDispatch();

  function getDotID(index) {
    return dots[index].dot_id;
  }
  const handleSubmit = async (e) => {
    console.log("AddSensor: Submiting Flag changed");
    setIsUploading(true);
    if (index >= 0) {
      console.log("AddSensor: index ", index);
      let dotID = getDotID(index);
      const gid = (
        Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      ).toUpperCase();

      const formDotData = new FormData();
      formDotData.append("dot_id", dots[index].dot_id);
      formDotData.append("parent_id", dots[index].parent_id);
      formDotData.append("x", Math.round(dots[index].x));
      formDotData.append("y", Math.round(dots[index].y));
      formDotData.append("is_sensor", true);
      //action for bool
      formDotData.append("is_image", false);
      formDotData.append("child_id", gid);
      let url = `http://localhost:8000/image/dot/${dots[index].parent_id}/`;
      console.log("AddSensor: DEleting dot at index", index);
      dispatch(DeleteDot(index));
      console.log("AddSensor: Sending Data");
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
      console.log("AddSensor: Sent Sensor POST Req");
      onHide();
      console.log("AddSensor: Called Refresh Image Component");
      refresh((p) => {
        return p + 1;
      });

      setIsUploading(false);
    } else {
      console.log("AddSensor: index is -ve");
    }
  };
  return <></>;
}

export default AddSensor;
