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

function EditImage(params) {
  /*********************************************************** Hooks ********************************************************* */
  const dispatch = useDispatch();
  const images = useSelector((state) => state.img);
  const currUser = useSelector((state) => state.curr_user);

  /*********************************************************** States ********************************************************* */
  const [isFetchingParentImg, setIsFetchingParentImg] = useState(true);
  const [refresh, setRefresh] = useState(0);

  /*********************************************************** Body ********************************************************* */
  var parentImgArray = [];

  if (!isFetchingParentImg) {
    for (let key in images) {
      if (images[key].pid == "-1") {
        parentImgArray.push(images[key]);
        continue;
      }
    }
  }
  /*********************************************************** Console Statements ********************************************** */

  console.log("Home: Images from Store", images);
  console.log("Home: Parent Images:", parentImgArray);

  /*********************************************************** Functions ********************************************** **********/

  function handleDelete(id) {
    // console.log("Home: Req For Delete parent Image: ", id);
    setRefresh((p) => {
      return p + 1;
    });
  }
  /*********************************************************** Use Effects ******************************************************** */
  useEffect(async () => {
    setIsFetchingParentImg(true);
    let url = `http://localhost:8000/image/images/${currUser.username}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    dispatch({
      type: "FETCH_IMAGES",
      payload: res.data,
    });
    console.log("Done Dispatching Images");
    setIsFetchingParentImg(false);
  }, [refresh]);
  /*********************************************************** Render Function ********************************************** */
  return (
    <>
      {isFetchingParentImg && (
        <Alert variant="warning">Fetching Data from Server</Alert>
      )}
      {!isFetchingParentImg && (
        <Container fluid="sm" style={{ padding: "50px" }}>
          <Row className="justify-content-sm-center">
            {parentImgArray.map((image, i) => {
              return (
                <>
                  <Col xs={10} md="auto" lg="auto" style={{ margin: "100px" }}>
                    <Card xl>
                      {image.image_name}
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
    </>
  );
}

export default EditImage;
