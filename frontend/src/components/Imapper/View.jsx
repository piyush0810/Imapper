import { useState, useEffect, useRef, shallowEqual } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";

function View(params) {
  console.log("View: Component Rendered");
  const dispatch = useDispatch();
  const images = useSelector((state) => state.img);
  console.log("View: Images from Store", images);
  const [isFetchingParentImg, setIsFetchingParentImg] = useState(true);
  const [refresh, setRefresh] = useState(0);
  var parentImgArray = [];

  if (!isFetchingParentImg) {
    for (let key in images) {
      if (images[key].pid == "-1") {
        parentImgArray.push(images[key]);
        continue;
      }
    }
    console.log("View: Parent Images:", parentImgArray);
  }
  console.log("View: Ended Home COmp");

  useEffect(async () => {
    setIsFetchingParentImg(true);
    let url = "http://localhost:8000/image/images/";
    const res = await axios.get(url);
    dispatch({
      type: "FETCH_IMAGES",
      payload: res.data,
    });
    console.log("View: Done Dispatching Images");
    setIsFetchingParentImg(false);
  }, [refresh]);
  return (
    <>
      {isFetchingParentImg && (
        <Alert variant="warning">Fetching Data from Server</Alert>
      )}
      {!isFetchingParentImg && (
        <Container fluid style={{ marginTop: "10px" }}>
          <Row className="justify-content-sm-center">
            {parentImgArray.map((image, i) => {
              return (
                <>
                  <Col xs={12} md="auto" lg="auto" style={{ margin: "10px" }}>
                    <Card xl>
                      <Link to={`/viewimage/${image.image_id}`}>
                        <Card.Img
                          src={"http://localhost:8000" + image.image}
                          style={{
                            maxHeight: "480px",
                            maxWidth: "100%",
                            padding: "5px",
                          }}
                        />
                      </Link>
                    </Card>
                  </Col>
                </>
              );
            })}
          </Row>
        </Container>
      )}
    </>
  );
}

export default View;
