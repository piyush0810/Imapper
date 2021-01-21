import React, { useState, useEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";

// {
//   Post: "/image/:id", { id: ""<string>, preview: ""<string>, raw: ""<binary>, sensors: []<array of string>, images: []<array of string> };
//   Get: "/image/:id", {};
// }

function Image(props) {
  const { imageID } = useParams();
  console.log(`Image ${imageID} Recieved in Image`);
  const [image, setImage] = useState({
    id: "",
    preview: "",
    raw: "",
    sensors: [],
    images: [],
  });
  const handleDelete = (e) => {
    setImage({ preview: "", raw: "" });
    imageRef.current.value = "";
    setIsUpload(false);
  };
  const [dots, setdots] = useState([]);

  const addDot = (dot) => {
    setdots((prev) => {
      return [...prev, dot];
    });
  };
  const deleteDot = (index) => {
    setdots((prev) => {
      return prev.filter((e, i) => {
        return i != index;
      });
    });
  };
  useEffect(() => {
    //fetching Image Data from DB

    return () => {};
  }, []);
  return (
    <div>
      <ReactImageDot
        backgroundImageUrl={image.preview}
        width={480}
        height={480}
        dots={dots}
        deleteDot={deleteDot}
        addDot={addDot}
        dotRadius={6}
        dotStyles={{
          backgroundColor: "red",
          boxShadow: "0 2px 4px gray",
        }}
        backgroundSize={"cover"}
      />
      <DotsInfo
        height={480}
        width={480}
        dots={dots}
        deleteDot={deleteDot}
        pid={image.id}
      />
    </div>
  );
}

export default Image;
