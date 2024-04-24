import React from 'react'
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const SideNav = (props) => {
  const navigate = useNavigate();
  return (
    <ListGroup>
      <Link to="/">
        <ListGroupItem
          action
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </ListGroupItem>
      </Link>

      <Link to="/myScore">
        <ListGroupItem
          action
          onClick={() => {
            navigate("/myScore");
          }}
        >
          My Score
        </ListGroupItem>
      </Link>

      <Link to="/hof">
        <ListGroupItem
          action
          onClick={() => {
            navigate("/hof");
          }}
        >
          Hall of Fame
        </ListGroupItem>
      </Link>
   </ListGroup>
  );
}

export default SideNav