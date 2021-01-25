import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  i: PropTypes.number.isRequired,
  moveDot: PropTypes.func.isRequired,
  dotRadius: PropTypes.number,

  styles: PropTypes.object,
};

const defaultProps = {
  dotRadius: 5,
};

Dot.propTypes = propTypes;
Dot.defaultProps = defaultProps;

function Dot(props) {
  console.log("Dots Component rendered");
  const { x, y, styles, dotRadius } = props;
  const onMouseDown = () => {
    props.moveDot(props.i);
  };
  return (
    <div
      className="react-image-dot"
      onMouseDown={onMouseDown}
      style={{
        ...styles,
        height: dotRadius * 2,
        width: dotRadius * 2,
        borderRadius: dotRadius,
        transform: `translate(${-dotRadius}, ${-dotRadius})`,
        top: y,
        left: x,
      }}
    />
  );
}

export default Dot;
