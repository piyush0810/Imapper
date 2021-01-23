import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

function AddImage() {
  console.log("New AddImage Created");
  //states
  const imageRef = useRef(null);
  const [image, setImage] = useState({
    title: "",
    image: null,
    info: null,
    image_id: "",
    content: "",
  });
  const [isUpload, setIsUpload] = useState(false);

  const { pid } = useParams();
  const history = useHistory();
  if (pid) {
    console.log("Type 2 Request: From", pid);
  }

  const handleChange = (e) => {
    const gid = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();
    setImage({ image: e.target.files[0], image_id: gid });
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (image.image) {
      const formData = new FormData();
      formData.append("image", image.image);
      formData.append("title", "IIT Mumbai");
      formData.append("info", image.info);
      formData.append("image_id", image.image_id);
      formData.append("content", image.content);

      let url = "http://localhost:8000/image/images/";
      axios
        .post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "",
          },
        })
        .then((res) => {
          console.log(res.data);
          console.log("Hello");
        })
        .catch((err) => console.log(err));
      setIsUpload(true);

      history.push(`/image/${image.image_id}`);
      console.log("Added History");
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
