import { useState, useEffect, useRef, shallowEqual } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  makeStyles,
  Grid,
  Paper,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles({
  root: {
    maxWidth: "auto",
  },
});
function EditImage(params) {
  /*********************************************************** Hooks ********************************************************* */
  const dispatch = useDispatch();
  // const images = useSelector((state) => state.img);
  const currUser = useSelector((state) => state.curr_user);
  const classes = useStyles();

  /*********************************************************** States ********************************************************* */
  const [isFetchingParentImg, setIsFetchingParentImg] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackMSG, setsnackMSG] = useState("");
  const [images, setImages] = useState([]);

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
  console.log("Home: Bools", isFetchingParentImg);
  console.log("Home: Images from Store", images);
  console.log("Home: Parent Images:", parentImgArray);

  /*********************************************************** Functions ********************************************** **********/
  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }
  async function handleDelete(id) {
    // console.log("Home: Req For Delete parent Image: ", id);

    let url = `http://localhost:8000/image/imagedel/${id}/`;
    console.log("Image: Delete called");
    await axios.get(url);
    setsnackMSG("Successfully Deleted Site");
    setOpen(true);
    setRefresh((p) => {
      return p + 1;
    });
  }
  /*********************************************************** Use Effects ******************************************************** */
  useEffect(async () => {
    setIsFetchingParentImg(true);
    console.log("Username:", currUser.username);
    let url = `http://localhost:8000/image/images/${currUser.username}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    console.log("res data", res.data);
    setImages([...res.data]);
    dispatch({
      type: "FETCH_IMAGES",
      payload: res.data,
    });
    console.log("Done Dispatching Images");
    setIsFetchingParentImg(false);
  }, [refresh, currUser]);
  /*********************************************************** Render Function ********************************************** */
  return (
    <>
      {isFetchingParentImg && (
        <Alert severity="info">Fetching Data from Server</Alert>
      )}
      {!isFetchingParentImg && (
        <Container fixed style={{ padding: "50px" }}>
          <Paper elevation={3}>
            <Grid container style={{ padding: "5px" }}>
              <Grid xs={12} item>
                {parentImgArray.map((image, i) => {
                  return (
                    <>
                      <Card className={classes.root}>
                        <CardActionArea>
                          <Link to={`/image/${image.image_id}`}>
                            <CardMedia
                              component="img"
                              alt="Contemplative Reptile"
                              height="320"
                              image={"http://localhost:8000" + image.image}
                              title={image.image_name}
                            />
                          </Link>
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {image.image_name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <Button
                            size="small"
                            color="secondary"
                            onClick={() => {
                              handleDelete(image.image_id);
                            }}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </>
                  );
                })}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackMSG}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EditImage;
