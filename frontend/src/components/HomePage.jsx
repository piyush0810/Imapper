import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AddCurrUser } from "../actions/user/userActions";
import Alert from "@material-ui/lab/Alert";
import {
  Button,
  Card,
  Container,
  FormControl,
  Icon,
  InputLabel,
  NativeSelect,
  TextField,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { Form } from "reactstrap";
import { backendUrl } from "../actions/backendUrl";

let backurl = process.env.REACT_APP_DEV_URL || backendUrl;
const HomePage = ({ registration_message }) => {
  /*********************************************************** Hooks ********************************************************* */
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.auth.authenticated);

  /*********************************************************** States ********************************************************* */
  const [siteAdminUsername, setSiteAdminUsername] = useState("");
  const [currUser, setcurrUser] = useState({
    username: "",
    parent_name: "",
    is_admin: "",
    is_staff: "",
    is_approved: "",
  });
  const [sentRequestNotAccepted, setSentRequestNotAccepted] = useState(false);
  const [needToSendReq, setNeedToSendReq] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [value, setValue] = useState({
    is_admin: false,
    is_staff: false,
    is_viewer: false,
  });
  const [isFetchingData, setIsFetchingData] = useState(true);
  /*********************************************************** Body ********************************************************* */
  console.log("HomePage: RefreshValue:", refresh);
  console.log("HomePage: Fetching Data:", isFetchingData);
  console.log("HomePage: CurrUser:", currUser);
  console.log("HomePage: Authenticated Bool", authenticated);
  /*********************************************************** UseEffects ********************************************************* */

  useEffect(() => {
    console.log("CalledFunction");
    if (!currUser.is_approved) {
      if (!currUser.is_admin && !currUser.is_staff) {
        setNeedToSendReq(true);
        setSentRequestNotAccepted(false);
      } else {
        setSentRequestNotAccepted(true);
        setNeedToSendReq(false);
      }
    } else {
      setNeedToSendReq(false);
      setSentRequestNotAccepted(false);
    }
  }, [isFetchingData]);
  useEffect(async () => {
    console.log("Fetching Effect called");
    setIsFetchingData(true);
    if (authenticated) {
      console.log("Inside");
      let url = `${backurl}/user/name/`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
        },
      });
      console.log("UserData", res.data);
      setcurrUser({
        username: res.data.username,
        parent_name: res.data.parent_name,
        is_admin: res.data.is_admin,
        is_staff: res.data.is_staff,
        is_approved: res.data.is_approved,
      });
      //dispatch(AddCurrUser(res.data));
      setIsFetchingData(false);
    }
  }, [refresh, authenticated]);

  /*********************************************************** Functions ********************************************************* */

  const handleChange = async (event) => {
    if (event.target.value == "admin") {
      setValue({ is_admin: true, is_staff: false, is_viewer: false });
    } else if (event.target.value == "staff") {
      setValue({ is_admin: false, is_staff: true, is_viewer: false });
    } else if (event.target.value == "viewer") {
      setValue({ is_admin: false, is_staff: false, is_viewer: true });
    } else {
      setValue({ is_admin: false, is_staff: false, is_viewer: false });
    }
  };
  const submitRequest = async (e) => {
    e.preventDefault();
    console.log("StaffUsername", siteAdminUsername);
    console.log("RefreshvalueInside Fun", refresh);
    let url = `${backurl}/user/name/`;
    const formDotData = new FormData();
    if (value.is_admin || value.is_viewer || value.is_staff) {
      formDotData.append("username", currUser.username);
      formDotData.append("parent_name", siteAdminUsername);
      formDotData.append("is_admin", value.is_admin ? 1 : 0);
      formDotData.append("is_staff", value.is_staff ? 1 : 0);
      formDotData.append("is_approved", value.is_viewer ? 1 : 0);
      const resp = await axios
        .post(url, formDotData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
          },
        })
        .catch((err) => console.log(err));
      console.log("Sent Req");
      setRefresh(refresh + 1);
    }
  };
  /*********************************************************** Render Function ********************************************************* */

  return (
    <>
      {registration_message && (
        <div className="alert alert-info text-center mt-4" role="alert">
          <strong>{registration_message}</strong>
        </div>
      )}
      {!isFetchingData && (
        <Container fixed style={{ maxWidth: "480px", marginTop: "10px" }}>
          {sentRequestNotAccepted && (
            <Alert severity="info">Request For Approval Sent</Alert>
          )}
          {needToSendReq && (
            <Card style={{ padding: "50px" }}>
              <Form>
                <FormControl style={{ margin: "5px" }}>
                  <InputLabel shrink htmlFor="age-native-label-placeholder">
                    Request For
                  </InputLabel>
                  <NativeSelect onChange={handleChange}>
                    <option value="">None</option>
                    <option value={"admin"}>Admin Access</option>
                    <option value={"staff"}>Site Admin Access</option>
                    <option value={"viewer"}>Viewer Access</option>
                  </NativeSelect>
                </FormControl>
                <br />
                {value.is_viewer && (
                  <FormControl style={{ margin: "5px" }}>
                    <TextField
                      required
                      placeholder="Enter Staff username"
                      onChange={(e) => {
                        setSiteAdminUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                )}
                <br />
                <FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    onClick={(e) => {
                      submitRequest(e);
                    }}
                  >
                    Send
                  </Button>
                </FormControl>
              </Form>
            </Card>
          )}
        </Container>
      )}
    </>
  );
};

export default HomePage;
