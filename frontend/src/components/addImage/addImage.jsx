import { useState, useEffect, useRef } from "react";
import ReactImageDot from "../dots/ReactImageDot";
import DotsInfo from "../dots/DotsInfo";
const { v4: uuidv4 } = require("uuid");
function AddImage() {
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
    }
  };
  const handleDelete = (e) => {
    setImage({ preview: "", raw: "" });
    imageRef.current.value = "";
    setIsUpload(false);
  };
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
      {isUpload && (
        <div>
          <ReactImageDot
            backgroundImageUrl={image.preview}
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
            pid={image.id}
          />
        </div>
      )}
    </div>
  );
}

export default AddImage;
