import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
function AddImage() {
  console.log("AddImage Component Rendered");
  //states
  const imageRef = useRef(null);
  const [image, setImage] = useState({
    dots: null,
    image: null,
    image_id: "",
    pid: "",
  });
  const [isUpload, setIsUpload] = useState(false);
  const dispatch = useDispatch();

  const { pid } = useParams();
  const history = useHistory();
  if (pid) {
    console.log("Type 2 Request: From", pid);
  }
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
  const handleChange = (e) => {
    const gid = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();
    setImage({ image: e.target.files[0], image_id: gid });
  };
  const handleUpload = async (e) => {
    // e.preventDefault();
    if (image.image) {
      const formData = new FormData();
      formData.append("image", image.image);
      formData.append("dots", image.dots);
      formData.append("image_id", image.image_id);
      formData.append("pid", image.pid);
      let url = "http://localhost:8000/image/images/";
      axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "",
          },
        })
        .then((res) => {
          // console.log(res.data);
          // console.log("Hello");
          if (!isUpload) {
            console.log("Fetching new DATAAA");
            (async () => {
              await dispatch(getData());
            })();
          }
          setIsUpload(true);
          history.push(`/image/${image.image_id}`);
        })
        .catch((err) => console.log(err));

      // console.log("Added History");
    }
  };
  const handleDelete = (e) => {
    setImage({ image: null });
    imageRef.current.value = "";
    setIsUpload(false);
  };

  return (
    <div>
      {!isUpload && (
        <div>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="upload-button"
            onChange={handleChange}
            ref={imageRef}
          />
          <br />
          <section>
            <button onClick={handleDelete}>Close</button>
            <button onClick={handleUpload} type="submit">
              Upload
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default AddImage;
