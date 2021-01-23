import React, { useState, useEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
// {
//   Post: "/image/:id", { id: ""<string>, preview: ""<string>, raw: ""<binary>, sensors: []<array of string>, images: []<array of string> };
//   Get: "/image/:id", {};
// }

function Image(props) {
  const { imageID } = useParams();
  console.log(`Image ${imageID} Recieved in Image`);
  const [image, setImage] = useState({
    title: "",
    image: null,
    info: null,
    image_id: "",
    content: "",
  });
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

    let url = `http://localhost:8000/image/${imageID}`;
    console.log(`sending GET req to ${url}`);
    axios({
      method: "get",
      url,
      auth: { username: "brownie", password: "piyush0810" },
    })
      .then((response) => {
        console.log(response.data[0]);
        setImage({
          info: response.data[0].info,
          content: response.data[0].content,
          title: response.data[0].title,
          image: response.data[0].image,
        });
        console.log("Address:", image.image);
        console.log("Done Fetching");
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {};
  }, []);
  return (
    <div>
      <ReactImageDot
        backgroundImageUrl={"http://localhost:8000" + image.image}
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
        pid={image.image_id}
      />
    </div>
  );
}

export default Image;
