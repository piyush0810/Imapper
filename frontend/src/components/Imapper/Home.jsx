import { useState, useEffect, useRef, shallowEqual } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import UploadImage from "./UploadImage";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";
function Home(params) {
  console.log("Home: Component Rendered");
  const dispatch = useDispatch();
  const images = useSelector((state) => state.img);
  console.log("Home: Images from Store", images);
  const [isFetchingParentImg, setIsFetchingParentImg] = useState(true);
  const [modalUploadImg, setModalUploadImg] = useState(false);
  const [refresh, setRefresh] = useState(0);
  var parentImgArray = [];

  if (!isFetchingParentImg) {
    for (let key in images) {
      if (images[key].pid == "-1") {
        parentImgArray.push(images[key]);
        continue;
      }
    }
    console.log("Home: Parent Images:", parentImgArray);
  }
  console.log("Home: Ended Home COmp");
  function handleAddImage() {
    setModalUploadImg(true);
  }
  function handleDelete(id) {
    console.log("Home: Req For Delete parent Image: ", id);
    setRefresh((p) => {
      return p + 1;
    });
  }
  useEffect(async () => {
    setIsFetchingParentImg(true);
    let url = "http://localhost:8000/image/images/";
    const res = await axios.get(url);
    dispatch({
      type: "FETCH_IMAGES",
      payload: res.data,
    });
    console.log("Done Dispatching Images");
    setIsFetchingParentImg(false);
  }, [refresh]);
  return (
    <>
      {isFetchingParentImg && (
        <Alert variant="warning">Fetching Data from Server</Alert>
      )}
      {!isFetchingParentImg && (
        <Container fluid="sm" style={{ padding: "50px" }}>
          <Row className="justify-content-sm-center">
            <Button
              variant="outline-primary"
              onClick={handleAddImage}
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            >
              Add Parent Image
            </Button>
          </Row>
          <Row className="justify-content-sm-center">
            {parentImgArray.map((image, i) => {
              return (
                <>
                  <Col xs={10} md="auto" lg="auto" style={{ margin: "100px" }}>
                    <Card xl>
                      <Link to={`/image/${image.image_id}`}>
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
                  <Col xs={2} md="auto" lg="auto">
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        handleDelete(image.image_id);
                      }}
                    >
                      Delete
                    </Button>
                  </Col>
                </>
              );
            })}
          </Row>
        </Container>
      )}
      <UploadImage
        show={modalUploadImg}
        onHide={() => {
          setModalUploadImg(false);
        }}
        pid={"-1"}
        refresh={setRefresh}
        index={-1}
      />
    </>
  );
}
export default Home;
