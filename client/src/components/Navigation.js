import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Navbar, Nav, ListGroupItem, Form } from "react-bootstrap";
import { LogoutButton } from "./AuthComponents";
import { Link, Navigate } from "react-router-dom";

const Navigation = (props) => {
  return (
    <Navbar
      expand="sm"
      fixed="top"
      className="top-nav-bar"
    >
      <Link to="/">
        <Navbar.Brand>
          <i className="bi bi-boxes" />
          &nbsp;
          Categories 🔥
        </Navbar.Brand>
      </Link>
      <Nav className="ml-md-auto">
        <Navbar.Text className="mx-2">
          {props.user && props.user.name && <span className="nav-user">{`Welcome, ${props.user.name}!`}</span>}
        </Navbar.Text>
        &nbsp;
        &nbsp;
        <Form className="mx-2 logout-btn">
          {props.loggedIn ? <LogoutButton logout={props.logout} /> : <></>}
        </Form>
      </Nav>
    </Navbar>
  );
};

export default Navigation; 