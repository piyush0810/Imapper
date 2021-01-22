import React from "react";
import { Link } from "react-router-dom";

export default function DotsInfo({ height, width, dots, deleteDot, pid }) {
  console.log("Image Add request from", pid);
  return (
    <ul>
      {dots.map((dot, i) => {
        return (
          <>
            <li>
              <p>
                Dot {i} <button onClick={() => deleteDot(i)}>Remove</button>
              </p>
              <p>
                Coordinates: x: {dot.x}, y: {dot.y}
              </p>
              <button>Add Sensor</button>
              <Link to={`/addimage/${pid}`}>
                <button>Add Image</button>
              </Link>
            </li>
          </>
        );
      })}
    </ul>
  );
}
