import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";

import { Container, Row, Col, Card } from "react-bootstrap";

function ViewImage(params) {
  const dispatch = useDispatch();

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
  return (
    <>
      <Container>
        <Row>
          <Card className="bg-dark text-white">
            <Card.Img
              src={"http://localhost:8000" + parentImg}
              alt="Card image"
            />
            <Card.ImgOverlay>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This content is a little bit
                longer.
              </Card.Text>
              <Card.Text>Last updated 3 mins ago</Card.Text>
            </Card.ImgOverlay>
          </Card>
        </Row>
      </Container>
    </>
  );
}
export default ViewImage;
