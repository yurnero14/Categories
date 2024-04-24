import { useState } from "react";
import { Form, Button, Row, Alert,  Col } from "react-bootstrap";

function LoginForm(props) {
  // console.log(props);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { email, password };

    props.login(credentials);
  };
  
  return (
    <Row >
      <Col></Col>
      <Col>
        <Form onSubmit={handleSubmit}>
            <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger">
                {errorMessage}
              </Alert>
          <Form.Group controlId="email">
            <Form.Label>email(for guest use this email: guest@polito.it)</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required={true}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password(for guest use this password: webapplication3)</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required={true}
              minLength={6}
            />
          </Form.Group>

          <Button type="submit">Login</Button> &nbsp;
          
        </Form>
      </Col>
      <Col>
      </Col>
    </Row>
    
  );
}

function LogoutButton(props) { 
  return (
    <Row>
      <Col>
        <Button variant="success" onClick={props.logout}>
          Logout
        </Button>
      </Col>
    </Row>
  );
}

export {LoginForm, LogoutButton};
