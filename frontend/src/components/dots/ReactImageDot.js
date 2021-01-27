import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Dot from "./Dot";
import { AddDot, DeleteDot } from "../../actions/dots/dotsActions";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";

const propTypes = {
  // Required functions to handle parent-level state management

  resetDots: PropTypes.func,
  key: PropTypes.string,
  // CSS Styles for dots
  dotStyles: PropTypes.object,

  // The radius of the dot
  dotRadius: PropTypes.number,

  // The background color to use
  backgroundColor: PropTypes.string,

  // Parent Image Id
  pid: PropTypes.string,
  // The background image url to use
  backgroundImageUrl: PropTypes.string,

  // Additional styles for container
  styles: PropTypes.object,

  // Backgroundsize if needed
  backgroundSize: PropTypes.string,

  // The width in pixels of the box. If unset, will be 100%
  width: PropTypes.number,

  // The width in pixels of height
  height: PropTypes.number,

  // To use pixel coordinates vs a scale from 0-1
  pixelCoordinates: PropTypes.bool,
};

const defaultProps = {
  pixelCoordinates: false,
  backgroundSize: "cover",
};

function ReactImageDot(props) {
  console.log("ReactImageDot Component Rendered");
  const [grabbing, setgrabbing] = useState(false);
  const {
    width,
    height,
    styles,
    dotStyles,
    backgroundColor,
    backgroundImageUrl,
    dotRadius,
    backgroundSize,
    pid,
    Dots,
  } = props;
  console.log("Dots Recieved From Param in ReactImageDot", Dots);
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
  // console.log("Final Dots", dots);
  const dispatch = useDispatch();

  function addDot(dot) {
    // console.log("Dispatching addDot function");
    dispatch(AddDot(dot));
  }
  function deleteDot(index) {
    dispatch(DeleteDot(index));
  }
  const onMouseUp = (e) => {
    const bounds = e.target.getBoundingClientRect();
    setgrabbing(true);
    const gid = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();
    addDot({
      dot_id: gid,
      x: Math.round(e.clientX - bounds.left),
      y: e.clientY - bounds.top,
      parent_id: pid,
      is_sensor: 0,
      is_image: 0,
      child_id: "",
    });
  };

  const moveDot = (index) => {
    setgrabbing(false);
    deleteDot(index);
  };

  const resetDots = () => {
    props.resetDots();
  };

  const grabClass = grabbing ? "react-image-dot__grabbing" : "";

  // console.log("URL in ReactImageDot->", backgroundImageUrl);
  // console.log(dots);
  return (
    <>
      <Container className="react-image-dot__container">
        <Card
          className="bg-dark text-white `react-image-dot__wrapper ${grabClass}`"
          onMouseUp={onMouseUp}
          style={{
            ...styles,
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width,
            height,
            backgroundSize,
          }}
        >
          {dots.map((dot, i) => (
            <Dot
              x={dot.x}
              y={dot.y}
              i={i}
              styles={dotStyles}
              moveDot={moveDot}
              dotRadius={dotRadius}
            />
          ))}
        </Card>
        {props.resetDots && <button onClick={resetDots}>Reset</button>}
      </Container>
    </>
  );
}

ReactImageDot.propTypes = propTypes;
ReactImageDot.defaultProps = defaultProps;
export default ReactImageDot;
