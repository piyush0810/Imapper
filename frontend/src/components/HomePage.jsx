import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const HomePage = ({ registration_message }) => {
  console.log("HomePage Component gets rendered");
  const dispatch = useDispatch();
  const fetchImages = useSelector((state) => state.img.fetchImageCall);
  console.log(fetchImages);
  function changeToStoreData(object) {
    var newObject = {};
    for (const [key, value] of Object.entries(object)) {
      // console.log(key, value);
      newObject[value.image_id] = { ...value };
    }
    // console.log(newObject);
    return newObject;
  }
  function getData() {
    return (dispatch) => {
      axios.get("http://localhost:8000/image/images/").then((res) => {
        console.log("Fetched Images Data", res.data);
        var modifiedImagesData = changeToStoreData(res.data);
        dispatch({
          type: "FETCH_IMAGES",
          payload: modifiedImagesData,
        });
      });
    };
  }
  useEffect(() => {
    dispatch(getData());
  }, [fetchImages]);

  return (
    <div className="container">
      {registration_message && (
        <div className="alert alert-info text-center mt-4" role="alert">
          <strong>{registration_message}</strong>
        </div>
      )}
      <h3 className="text-center mt-4">Hello world.</h3>
    </div>
  );
};

export default HomePage;
