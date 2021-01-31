import { NavLink as Link, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";

// import "../index.css";
import Fab from "@material-ui/core/Fab";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

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

function Navigation(props) {
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
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/addproject"
                    activeClassName="active"
                    exact
                    onClick={toggleNavbarOnClick}
                  >
                    Add Project
                  </NavLink>
                </NavItem>
              )}
              {props.authenticated && (
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/view"
                    activeClassName="active"
                    exact
                    onClick={toggleNavbarOnClick}
                  >
                    View Project
                  </NavLink>
                </NavItem>
              )}
              {userIsNotAuthenticated()}
              {userIsAuthenticatedEmail()}
            </Nav>
          </Collapse>
        </Navbar>
        <Fab color="#292B2C" style={{ margin: "5px" }}>
          <ArrowBackIcon
            onClick={() => {
              console.log("Back Button Clicked");
              history.goBack();
            }}
          />
        </Fab>
        <Fab color="#292B2C" aria-label="add" style={{ margin: "5px" }}>
          <ArrowForwardIcon
            onClick={() => {
              console.log("Forward Button Clicked");
              history.goForward();
            }}
          />
        </Fab>
      </div>
    </>
  );
}
export default Navigation;
