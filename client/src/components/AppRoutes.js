import {Container, Row,Form,FormControl,Button, Navbar,Col} from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import {LoginForm} from './AuthComponents';
import CreateRoundForm from './CreateRound';
import SideNav from './SideNav';

function CategoryDefault(props){
  return (
    <Row className="vh-100">
      <Col md={2} bg="light" className="below-nav side-nav">
        <SideNav user={props.user} getmyscore={props.getmyscore}/>
      </Col>
      <Col md={10} className="below-nav">
        <Outlet/>
      </Col>
    </Row>
  )
}
function MainLayout(props){
  console.log(props);
  return(
      <>
      <h1>Dare to play?</h1>
      <p>Please select a Category and Difficulty.</p>
      <CreateRoundForm user={props.user} round={props.round} currentRound={props.currentRound} response={props.response} createRound={props.createRound}  getAllrounds={props.getAllrounds}/>
      </>
  );
}
function NotFound(){
  return(
      <>
      <h1>This NotFound</h1>
      </>
  );
}

function LoginRoute(props) {
    return(
      <>
        <Row>
          <Col>
            <h1>Login</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <LoginForm login={props.login} guestlogin={props.guestLogin} />
          </Col>
        </Row>
      </>
    );
  }

  export{CategoryDefault, LoginRoute, MainLayout, NotFound};