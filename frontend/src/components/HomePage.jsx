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
const HomePage = ({ registration_message }) => {
  const dispatch = useDispatch();
  const [staffUsername, setStaffUsername] = useState("");

  const [currUser, setcurrUser] = useState({
    username: "",
    parent_name: "",
    is_admin: "",
    is_staff: "",
    is_approved: "",
  });
  console.log("HomePage: CurrUser:", currUser);
  var showReqSentAlert = false;
  if (!currUser.is_approved) {
    if (!currUser.is_admin && !currUser.is_staff) {
      showReqSentAlert = false;
    } else {
      showReqSentAlert = true;
    }
  } else {
    if (!currUser.is_admin && !currUser.is_staff) {
      showReqSentAlert = true;
    } else {
      showReqSentAlert = false;
      //Approved
    }
  }
  const [refresh, setRefresh] = useState(0);
  const [value, setValue] = useState({
    is_admin: false,
    is_staff: false,
    is_viewer: false,
  });

  useEffect(async () => {
    let url = `http://localhost:8000/user/name/`;
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
    dispatch(AddCurrUser(res.data));
  }, [refresh]);

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
    console.log("StaffUsername", staffUsername);
    let url = `http://localhost:8000/user/name/`;
    const formDotData = new FormData();
    if (value.is_admin || value.is_viewer || value.is_staff) {
      formDotData.append("username", currUser.username);
      formDotData.append("parent_name", staffUsername);
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
  return (
    <>
      {registration_message && (
        <div className="alert alert-info text-center mt-4" role="alert">
          <strong>{registration_message}</strong>
        </div>
      )}
      {currUser.username && (
        <Container fixed style={{ maxWidth: "480px", marginTop: "10px" }}>
          {showReqSentAlert && (
            <Alert severity="info">Request For Approval Sent</Alert>
          )}
          {!showReqSentAlert && (
            <Card style={{ padding: "50px" }}>
              <Form>
                <FormControl style={{ margin: "5px" }}>
                  <InputLabel shrink htmlFor="age-native-label-placeholder">
                    Request For
                  </InputLabel>
                  <NativeSelect onChange={handleChange}>
                    <option value="">None</option>
                    <option value={"admin"}>Admin Access</option>
                    <option value={"staff"}>Staff Access</option>
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
                        setStaffUsername(e.target.value);
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
                    onClick={submitRequest}
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
