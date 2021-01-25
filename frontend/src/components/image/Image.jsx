import React, { useState, useEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

function Image(props) {
  console.log("Image Component Rendered");
  const { imageID } = useParams();
  //console.log(`Image ${imageID} Recieved in Image`);

  const [dataFetched, setdataFetched] = useState(false);
  const imageData = useSelector((state) => state.img);

  // console.log("Image Data fetched from Store", imageData);
  const [image, setImage] = useState({
    title: "",
    image: null,
    info: null,
    image_id: "",
    content: "",
  });
  useEffect(() => {
    if (imageID in imageData) {
      console.log("Image Recieved from Store");
      setImage({
        title: imageData[imageID].title,
        image: imageData[imageID].image,
        info: imageData[imageID].info,
        image_id: imageData[imageID].image_id,
        content: imageData[imageID].content,
      });
      setdataFetched(true);
      // console.log("Image useState", image);
    } else {
      console.log("Image recieved from GET req");
      //fetching Image Data from DB
      let url = `http://localhost:8000/image/${imageID}`;
      // console.log(`sending GET req to ${url}`);
      axios({
        method: "get",
        url,
        auth: { username: "as10071999", password: "Aryan123" },
      })
        .then((response) => {
          // console.log("Printing Fetched");
          // console.log(response.data[0]);
          setImage({
            info: response.data[0].info,
            content: response.data[0].content,
            title: response.data[0].title,
            image: response.data[0].image,
            image_id: response.data[0].image_id,
          });
          // console.log("Image Date Set:", image);
          // console.log("Done Fetching");
          setdataFetched(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div>
      <ReactImageDot
        backgroundImageUrl={"http://localhost:8000" + image.image}
        width={480}
        height={480}
        dotRadius={6}
        dotStyles={{
          backgroundColor: "red",
          boxShadow: "0 2px 4px gray",
        }}
        backgroundSize={"cover"}
      />
      {dataFetched && (
        <DotsInfo height={480} width={480} pid={image.image_id} />
      )}
    </div>
  );
}

export default Image;
