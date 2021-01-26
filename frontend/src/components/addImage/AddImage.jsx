import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

function AddImage() {
  console.log("AddImage Component Rendered");
  //states
  const imageRef = useRef(null);

  const { pid, index } = useParams();
  const dots = useSelector((state) => state.dot.dots);

  const [image, setImage] = useState({
    dots: null,
    image: null,
    image_id: "",
    pid: pid ? pid : "-1",
  });
  console.log("Initilized Data", image);
  const [isUpload, setIsUpload] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    const gid = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();
    setImage({ ...image, image: e.target.files[0], image_id: gid });
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (image.image) {
      if (index) {
        const formDotData = new FormData();
        formDotData.append("dot_id", dots[index].dot_id);
        formDotData.append("parent_id", dots[index].parent_id);
        formDotData.append("x", dots[index].x);
        formDotData.append("y", dots[index].y);
        formDotData.append("is_sensor", false);
        //action for bool
        formDotData.append("is_image", true);
        formDotData.append("child_id", image.image_id);
        let url = `http://localhost:8000/image/dot/${dots[index].parent_id}/`;
        const resp = await axios
          .post(url, formDotData, {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: "",
            },
          })
          .catch((err) => console.log(err));
        console.log("Response", resp);
        console.log("Sent Dot POST Req");
      }
      const formData = new FormData();
      formData.append("image", image.image);
      formData.append("dots", image.dots);
      formData.append("image_id", image.image_id);
      formData.append("pid", image.pid);
      console.log("PId in FromData", image.pid);
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
          setIsUpload(true);
          history.push(`/image/${image.image_id}`);
        })
        .catch((err) => console.log(err));

      // console.log("Added History");
    } else {
      console.log("No File In Input");
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
