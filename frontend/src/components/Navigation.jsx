import { NavLink as Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import React, { useState, useEffect } from "react";
import { AddCurrUser } from "../actions/user/userActions";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
// import "../index.css";
import axios from "axios";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { func } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function Navigation(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const currUser = useSelector((state) => state.curr_user, shallowEqual);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [requests, setRequests] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  var AddSitesBool = false;
  var ViewSitesBool = false;
  var EditSitesBool = false;
  if (currUser.is_approved) {
    if (currUser.is_admin) {
      AddSitesBool = true;
      ViewSitesBool = true;
      EditSitesBool = true;
    } else if (currUser.is_staff) {
      AddSitesBool = true;
      ViewSitesBool = true;
      EditSitesBool = true;
    } else {
      if (!currUser.is_admin && !currUser.is_admin) {
        ViewSitesBool = true;
      }
    }
  }
  console.log("Navigation Data:", currUser);
  var history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  // const [toggle, setToggle] = useState()
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleNavbarOnClick = () => {
    if (window.innerWidth <= 989) {
      return toggle();
    }
  };

  const userIsAuthenticatedEmail = () => {
    if (props.authenticated) {
      return (
        <>
          <UncontrolledDropdown
            nav
            className="nav-item dropdown"
            key="email-auth"
          >
            <DropdownToggle nav caret className="nav-link">
              Account
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu">
              <DropdownItem
                className="inverse-dropdown"
                style={{ color: "#CECECE", textAlign: "center" }}
              >
                <span>{currUser.username}</span>
              </DropdownItem>
              <DropdownItem className="inverse-dropdown">
                <span key="signout" onClick={props.logoutAction}>
                  <NavLink
                    tag={Link}
                    to="/signout"
                    onClick={toggleNavbarOnClick}
                  >
                    Log out
                  </NavLink>
                </span>
              </DropdownItem>
              <DropdownItem className="inverse-dropdown">
                <NavLink
                  tag={Link}
                  to="/changepassword"
                  onClick={toggleNavbarOnClick}
                >
                  Change Password
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          ,
        </>
      );
    }
  };
  const userIsNotAuthenticated = () => {
    if (!props.authenticated) {
      return (
        <>
          <UncontrolledDropdown
            nav
            className="nav-item dropdown"
            key="not-auth"
          >
            <DropdownToggle nav caret className="nav-link">
              Login
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu">
              <DropdownItem className="inverse-dropdown">
                <NavLink
                  tag={Link}
                  to="/login"
                  key="log-in"
                  activeClassName="active"
                  exact
                  onClick={toggleNavbarOnClick}
                >
                  Site Log in
                </NavLink>
              </DropdownItem>
              <DropdownItem className="inverse-dropdown">
                <NavLink
                  tag={Link}
                  to="/register"
                  key="sign-up"
                  activeClassName="active"
                  exact
                  onClick={toggleNavbarOnClick}
                >
                  Register
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          ,
        </>
      );
    }
  };
  const handleReq = async (username, paylaod) => {
    let url = `http://localhost:8000/user/approval/${username}/`;

    const formData = new FormData();
    formData.append("key", paylaod);
    const resp = await axios
      .post(url, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
        },
      })
      .catch((err) => console.log(err));
    setRefresh(refresh + 1);
  };
  useEffect(async () => {
    let url = `http://localhost:8000/user/name/`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    dispatch(AddCurrUser(res.data));
  });
  useEffect(async () => {
    let url = "http://localhost:8000/user/approval/";
    const res = await axios.get(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("ecom_token")}`,
      },
    });
    setRequests([...res.data]);
    console.log("Fetching Requests:", res.data);
  }, [refresh]);
  return (
    <>
      <div>
        <Navbar
          color="faded"
          className="navbar navbar-toggleable-md navbar-inverse bg-inverse"
          expand="md"
        >
          <NavbarBrand href="/">Imapper</NavbarBrand>
          <NavbarToggler
            onClick={() => {
              toggle();
            }}
          />
          <Collapse isOpen={isOpen} navbar>
            <Nav navbar style={{ margin: "auto" }}>
              <NavItem>
                <NavLink
                  tag={Link}
                  to="/"
                  activeClassName="active"
                  exact
                  onClick={toggleNavbarOnClick}
                >
                  Home
                </NavLink>
              </NavItem>
              {props.authenticated && (
                <>
                  {AddSitesBool && (
                    <NavItem>
                      <NavLink
                        tag={Link}
                        to="/addsites"
                        activeClassName="active"
                        exact
                        onClick={toggleNavbarOnClick}
                      >
                        Add Sites
                      </NavLink>
                    </NavItem>
                  )}
                  {EditSitesBool && (
                    <NavItem>
                      <NavLink
                        tag={Link}
                        to="/editsites"
                        activeClassName="active"
                        exact
                        onClick={toggleNavbarOnClick}
                      >
                        Edit Sites
                      </NavLink>
                    </NavItem>
                  )}
                  {ViewSitesBool && (
                    <NavItem>
                      <NavLink
                        tag={Link}
                        to="/view"
                        activeClassName="active"
                        exact
                        onClick={toggleNavbarOnClick}
                      >
                        View Sites
                      </NavLink>
                    </NavItem>
                  )}
                  {currUser.is_admin && (
                    <>
                      <NavItem style={{ marginLeft: "100px" }}>
                        <IconButton component="span">
                          <Badge
                            badgeContent={requests.length}
                            color="secondary"
                          >
                            <NotificationsActiveOutlinedIcon
                              style={{ color: "#FFFFFF" }}
                              onClick={handleClick}
                            />
                          </Badge>
                        </IconButton>
                      </NavItem>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        {requests.map((req, i) => {
                          return (
                            <MenuItem>
                              <Card className={classes.root}>
                                <CardContent>
                                  <Typography
                                    className={classes.title}
                                    color="textSecondary"
                                    gutterBottom
                                  >
                                    User: {req.username}
                                  </Typography>
                                  <Typography variant="h5" component="h2">
                                    Staff Request
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    onClick={() => {
                                      handleReq(req.username, "True");
                                    }}
                                  >
                                    Accept
                                  </Button>

                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    onClick={() => {
                                      handleReq(req.username, "False");
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </CardActions>
                              </Card>
                            </MenuItem>
                          );
                        })}
                        {requests.length == 0 && (
                          <MenuItem>No Pending Requests</MenuItem>
                        )}
                      </Menu>
                    </>
                  )}
                </>
              )}
              {userIsNotAuthenticated()}
              {userIsAuthenticatedEmail()}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    </>
  );
}
export default Navigation;
