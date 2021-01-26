import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

function ViewImage(params) {
  const dispatch = useDispatch();
  function changeToStoreData(object) {
    var newObject = {};
    for (const [key, value] of Object.entries(object)) {
      // console.log(key, value);
      newObject[value.image_id] = { ...value };
    }
    return newObject;
  }
  function getData() {
    return (dispatch) => {
      axios.get("http://localhost:8000/image/images/").then((res) => {
        // console.log("Fetched Images Data", res.data);
        var modifiedImagesData = changeToStoreData(res.data);
        dispatch({
          type: "FETCH_IMAGES",
          payload: modifiedImagesData,
        });
      });
    };
  }
  useEffect(() => {
    console.log("Fetching Data Action called");
    dispatch(getData());
  }, []);
  return <>view Component</>;
}
export default ViewImage;
