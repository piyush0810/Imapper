import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

function Image(props) {
  const [isEditing, setEditing] = useState(false);

  console.log("Image Component Rendered");
  const { imageID } = useParams();
  //console.log(`Image ${imageID} Recieved in Image`);

  const [dataFetched, setdataFetched] = useState(false);

  const [image, setImage] = useState({
    dots: [],
    image: null,
    image_id: "",
    pid: "",
  });

  useEffect(async () => {
    console.log("Fetiching useEffect called");
    let urll = `http://localhost:8000/image/dot/${imageID}/`;
    console.log(`sending GET req to ${urll}`);
    const resp = await axios.get(urll);
    console.log(resp.data);

    console.log("DOTS recieved", image.dots);
    console.log("Image recieved from GET req");
    //fetching Image Data from DB
    let url = `http://localhost:8000/image/${imageID}`;
    // console.log(`sending GET req to ${url}`);
    axios({
      method: "get",
      url,
    })
      .then(async (response) => {
        console.log("Printing Fetched");
        console.log(response.data[0]);
        setImage({
          ...image,
          dots: resp.data,
          pid: response.data[0].pid,
          image: response.data[0].image,
          image_id: response.data[0].image_id,
        });

        console.log("Image Date Set:", image);

        console.log("Done Fetching");
        setdataFetched(true);
      })
      .catch((error) => {
        console.log(error);
      });
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
        pid={image.image_id}
        Dots={image.dots}
      />
      {dataFetched && (
        <DotsInfo
          height={480}
          width={480}
          pid={image.image_id}
          Dots={image.dots}
        />
      )}
    </div>
  );
}

export default Image;
