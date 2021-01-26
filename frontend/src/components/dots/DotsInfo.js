import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AddSensor from "../addSensor/AddSensor";
import { useSelector, useDispatch } from "react-redux";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";

export default function DotsInfo({ height, width, pid, dots }) {
  console.log("Dotsinfo Component Rendered");
  console.log(dots);
  // console.log("Image Add request from", pid);
  const [modalShow, setModalShow] = React.useState(false);
  const [isAddSensorClicked, setisAddSensorClicked] = useState(false);
  const [index, setIndex] = useState(-1);
  const dispatch = useDispatch();
  function handleAddSensor(i) {
    setModalShow(true);
    setIndex(i);
  }
  function deleteDot(index) {
    dispatch(DeleteDot(index));
  }

  return (
    <>
      <ul>
        {dots.map((dot, i) => {
          return (
            <>
              <li>
                <p>
                  Dot {i}{" "}
                  <button
                    onClick={() => {
                      deleteDot(i);
                    }}
                  >
                    Remove
                  </button>
                </p>
                <p>
                  Coordinates: x: {dot.x}, y: {dot.y}
                </p>
                <button
                  onClick={() => {
                    setisAddSensorClicked(true);
                    handleAddSensor(i);
                  }}
                >
                  Add Sensor
                </button>

                <Link to={`/addimage/${pid}/${i}`}>
                  <button>Add Image</button>
                </Link>
              </li>
            </>
          );
        })}
      </ul>

      {isAddSensorClicked && (
        <AddSensor
          onHide={() => setModalShow(false)}
          pid={pid}
          index={index}
          show={modalShow}
        />
      )}
    </>
  );
}
