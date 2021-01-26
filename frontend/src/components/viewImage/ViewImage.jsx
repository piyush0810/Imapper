import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";

function ViewImage(params) {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.img);
  console.log(images);
  let parentId = "";
  for (let key in images) {
    console.log(images[key]);
    if (images[key].pid == "-1") {
      parentId = images[key].image_id;
      continue;
    }

    break;
  }
  console.log("parent Id,", parentId);
  const [parentImg, setparentImg] = useState("");
  function getData() {
    return (dispatch) => {
      axios.get("http://localhost:8000/image/images/").then((res) => {
        // console.log("Fetched Images Data", res.data);
        dispatch({
          type: "FETCH_IMAGES",
          payload: res.data,
        });
      });
    };
  }
  useEffect(() => {
    console.log("Fetching Data Action called");
    dispatch(getData());
  }, []);

  useEffect(() => {
    if (parentId) {
      console.log("Image recieved from GET req");
      //fetching Image Data from DB
      let url = `http://localhost:8000/image/${parentId}`;
      console.log(`sending GET req to ${url}`);
      axios({
        method: "get",
        url,
        auth: { username: "as10071999", password: "Aryan123" },
      })
        .then((response) => {
          console.log("Printing Fetched");
          console.log(response.data[0]);

          // setdataFetched(true);
          setparentImg({
            dots: response.data[0].dots,
            pid: response.data[0].pid,
            image: response.data[0].image,
            image_id: response.data[0].image_id,
          });
          console.log("Image Data Set:", parentImg);
          console.log("Done Fetching");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [parentId]);
  return (
    <>
      <Container>
        <Row>
          <Card className="bg-dark text-white">
            <Card.Img
              src={"http://localhost:8000" + parentImg.image}
              alt="Card image"
            />
          </Card>
        </Row>
      </Container>
    </>
  );
}
export default ViewImage;
