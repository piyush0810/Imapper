import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { Alert } from "react-bootstrap";

function Image(props) {
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Image Component Rendered");

  const { imageID } = useParams();
  const [isFetchingImage, setisFetchingImage] = useState(true);
  const [callRefresh, setcallRefresh] = useState(0);
  const [image, setImage] = useState({
    dots: [],
    image: null,
    image_id: "",
    pid: "",
  });
  console.log("Image State:", image);
  console.log(
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Completed Rendered Image"
  );
  useEffect(async () => {
    console.log("--------------------Fetiching useEffect called");
    setisFetchingImage(true);
    if (imageID) {
      let urll = `http://localhost:8000/image/dot/${imageID}/`;
      // console.log(`sending GET req to ${urll}`);
      const resp = await axios.get(urll);
      // console.log("Dots Response Recieved", resp.data);
      //fetching Image Data from DB
      let url = `http://localhost:8000/image/${imageID}`;
      // console.log(`sending GET req to ${url}`);
      const res = await axios.get(url);
      // console.log("Printing Fetched Image Data:", res.data);
      console.log("Setting Image Data & Dots");
      if (res.data.length) {
        setImage({
          ...image,
          dots: resp.data,
          pid: res.data[0].pid,
          image: res.data[0].image,
          image_id: res.data[0].image_id,
        });
        // console.log("Changing Flag");
        setisFetchingImage(false);
        console.log("--------------------Fetiching useEffect Complete");
      }
    }
  }, [imageID, callRefresh]);

  return (
    <>
      {isFetchingImage && (
        <Alert variant="warning">
          Fetching Image Data or check the Image ID
        </Alert>
      )}
      {!isFetchingImage && (
        <div>
          <ReactImageDot
            backgroundImageUrl={"http://localhost:8000" + image.image}
            width="100%"
            height={640}
            dotRadius={6}
            dotStyles={{
              backgroundColor: "red",
              boxShadow: "0 2px 4px gray",
            }}
            backgroundSize={"cover"}
            pid={image.image_id}
            Dots={image.dots}
          />
          <DotsInfo
            height={480}
            width={480}
            pid={image.image_id}
            Dots={image.dots}
            refresh={setcallRefresh}
          />
        </div>
      )}
    </>
  );
}

export default Image;
