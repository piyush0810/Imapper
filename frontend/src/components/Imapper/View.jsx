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
  /*********************************************************** Hooks ********************************************************* */

  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.curr_user);
  const images = useSelector((state) => state.img);

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
  /*********************************************************** Console Statements ********************************************************* */
  console.log("View: Images from Store", images);
  console.log("View: Parent Images:", parentImgArray);
  /*********************************************************** UseEffects ********************************************************* */

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
    console.log("View: Done Dispatching Images");
    setIsFetchingParentImg(false);
  }, [refresh]);

  /*********************************************************** functions ********************************************************* */
  /*********************************************************** Render Function ********************************************************* */
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
