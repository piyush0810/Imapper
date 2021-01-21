import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const { v4: uuidv4 } = require("uuid");
function AddImage() {
  const history = useHistory();
  console.log("New AddImage Created");
  const imageRef = useRef(null);
  const [image, setImage] = useState({
    id: "",
    preview: "",
    raw: "",
    sensors: [],
    images: [],
  });
  const [isUpload, setIsUpload] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (imageRef.current.value) {
      console.log(imageRef.current.files[0]);
      //generating unique ID
      const gid = uuidv4();
      console.log(gid);
      setImage({
        id: gid,
        preview: URL.createObjectURL(imageRef.current.files[0]),
        raw: imageRef.current.files[0],
      });
      const formData = new FormData();
      formData.append("image", image.raw);
      setIsUpload(true);

      history.push(`/image/:${gid}`);
      console.log("Added History");
    }
  };
  const handleDelete = (e) => {
    setImage({ preview: "", raw: "" });
    imageRef.current.value = "";
    setIsUpload(false);
  };

  return (
    <div>
      {!isUpload && (
        <div>
          <input type="file" id="upload-button" ref={imageRef} />
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
