import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AddSensor from "../addSensor/AddSensor";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";
import AddImage from "../addImage/AddImage";

export default function DotsInfo({ height, width, pid, Dots }) {
  console.log("Dotsinfo Component Rendered");
  console.log("Prining dots from Param in DotsInfo", Dots);
  var dots = useSelector((state) => {
    // console.log("inside useSelector", state.dot.dots);
    return state.dot.dots;
  });
  // console.log("Returned State", dots);
  var myDots = [];
  dots.forEach(function (dot) {
    console.log(dot);
    if (dot.parent_id == pid) {
      myDots.push(dot);
    }
  });
  dots = [...Dots, ...myDots];

  // myDots = [...Dots, ...myDots];
  console.log("final Dots", dots);
  // useEffect(() => {
  //   var myDots = [];
  //   for (let dot in dots) {
  //     if (dot.parent_id == pid) {
  //       myDots.push(dot);
  //     }
  //   }
  //   dots = [...Dots, ...myDots];
  // }, [dots]);
  // console.log("Image Add request from", pid);
  const [modalShow, setModalShow] = React.useState(false);
  const [isAddSensorClicked, setIsAddSensorClicked] = useState(false);
  const [isAddImageClicked, setIsAddImageClicked] = useState(false);
  const [isAddedImage, setisAddedImage] = useState(false);
  const [index, setIndex] = useState(-1);
  const [isAddedSensor, setisAddedSensor] = useState(false);
  const dispatch = useDispatch();
  function handleAddSensor(i) {
    setModalShow(true);
    setIndex(i);
  }
  function handleAddImage(i) {
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
                {!dot.is_sensor && (
                  <button
                    onClick={() => {
                      setIsAddSensorClicked(true);
                      handleAddSensor(i - Dots.length);
                    }}
                  >
                    Add Sensor
                  </button>
                )}
                {/* <Link to={`/addimage/${pid}/${i}`}>
                      <button>Add Image</button>
                    </Link> */}
                {!dot.is_image && (
                  <button
                    onClick={() => {
                      setIsAddImageClicked(true);
                      handleAddImage(i - Dots.length);
                    }}
                  >
                    Add Image
                  </button>
                )}
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
          hideButton={setisAddedSensor}
        />
      )}
      {isAddImageClicked && (
        <AddImage pid={pid} index={index} hideButton={setisAddedImage} />
      )}
    </>
  );
}
