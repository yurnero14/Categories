import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  CategoryDefault,
  LoginRoute,
  MainLayout,
	NotFound,
} from "./components/AppRoutes";
import { Container, Row, Alert, Nav } from "react-bootstrap";
import { LogoutButton } from "./components/AuthComponents";

import API from "./API";
import CreateRoundForm from "./components/CreateRound";
import ResponseForm from "./components/ResponseForm";
import Navigation from "./components/Navigation";
import HallOfFame from "./components/HallOfFame";
import MyScore from "./components/MyScore";
import Round from "./Round";

function App() {
	return (
	<BrowserRouter>
      <Container fluid className="App">
        <Routes>
          <Route path="/*" element={<Main/>} />
        </Routes>
      </Container>
   </BrowserRouter>
	);
}
function Main(){
	const [round, setRound] = useState([]);
	// const [params, setParams] = useState();
  const [currentRound, setCurrentRound]=useState({});
  const[answerres, setAnswerres]=useState();
  const [response, setResponse] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [letter, setLetter]=useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const[myscore, setMyscore]=useState({});
  const[halloffamers, setHalloffamers]=useState({Category1: "Animals",
  hof1: "",
  hof1score: 0,
  Category2: "Countries", 
  hof2: "",
  hof2score: 0,
  Category3: "Colors",
  hof3: "",
  hof3score: 0})		
	// for Hall of Fame
	const dummyScores =[
		{name: 'sarib',score:{animals:2,colors:4,countries:100}},
		{name: 'arham',score:{animals:4,colors:1,countries:12}},
		{name: 'anas',score:{animals:3,colors:5,countries:13}},
		{name: 'zayan',score:{animals:10,colors:2,countries:30}}
	]
  // for My Score
	const dummyScore={ animals: 1, colors: 2, countries: 4 }
	
	const findLeaders=(scores)=>{
		let animalsLeader={name:'',score:0}, colorsLeader={name:'',score:0}, countriesLeader={name:'',score:0};
		scores.map(obj=>{
			if(obj.score.animals>animalsLeader.score){
			 animalsLeader.score=obj.score.animals
			 animalsLeader.name=obj.name
			}
			if(obj.score.colors>colorsLeader.score){
			 colorsLeader.score=obj.score.colors
			 colorsLeader.name=obj.name
			}
			if(obj.score.countries>countriesLeader.score){
			 countriesLeader.score=obj.score.countries
			 countriesLeader.name=obj.name
			}
		})
		return {animalsLeader:animalsLeader, colorsLeader:colorsLeader, countriesLeader:countriesLeader}
	}
	const leaders = findLeaders(dummyScores)
	
	const getAllrounds=async()=>{
		const rounds= await API.getAllrounds();
		setRound(rounds);
		console.log(rounds);
	}


  const createRound = async (params) => {
	try{
	
	let a= await API.createRound(params);
	console.log("a is", a);
	
  	setCurrentRound(a);
	console.log("alternating current", currentRound);
	
	setResponse({id:currentRound.resp_id, user_id:currentRound.user_id, round_id:currentRound.id, answers:null, score:null});
	

	console.log("response is ", response);
	
	}
	catch(err){
		console.log("Error is:", err);
		throw err;
	}
  }

  const giveAnswers = async(resp)=>{
	try{
		
		setAnswerres(await API.giveAnswers(resp));
		
	}
	catch(err){
		console.log("Error is:", err);
		throw err;
	}
  }

  const getmyscore=async ()=>{
	try{
		
		let a = await API.getmyscore();
		console.log("a is", a);
		// const b=Object.values(a);
		// console.log(b);
		
		return a;
		
	}
	catch(err){
		console.log("Error is:", err);
		throw err;
	}
  }
  const hallofFame=async()=>{
	try{
		let a = await API.getHallofFame();
		console.log("Hall of Fame is:", a);
		setHalloffamers(a);
		return a; 
	}
	catch(err){
		console.log("Error is:", err);
		throw err;
	}
  }
  useEffect(() => {
		const init = async () => {
			try {
				const user = await API.getUserInfo();  // here you have the user info, if already logged in
				setUser(user);
				setLoggedIn(true);
			} catch (err) {
				setUser(null);
				setLoggedIn(false);
			}
		};
		init();
	}, []);  // This useEffect is called only the first time the component is mounted.
	
	const handleLogin = async (credentials) => {
		try {
			const user = await API.logIn(credentials)
			setUser(user);
			setLoggedIn(true);
		} catch(err){
			throw err;
		}
	}
	const handleLogout = async () => {
		await API.logOut();
		setLoggedIn(false);
		setUser(null);
	}
	
  return (
    <>
        <Navigation logout = {handleLogout} user={user} loggedIn = {loggedIn} />
        
        <Routes>
          <Route path="/" element={
            loggedIn ? <CategoryDefault user={user} round={round} /*params ={params}*/ getAllrounds={getAllrounds} getmyscore={getmyscore} createRound={createRound} />  : <Navigate to="/login" replace/>
          }>
            <Route index element={<MainLayout user={user} round={round} /*params ={params}*/ getAllrounds={getAllrounds} createRound={createRound} />}/>
            <Route path="*" element={<NotFound />} />
            <Route path="createRoundForm" element={<CreateRoundForm user={user} round={round} currentRound={currentRound} response={response}/*params ={params}*/ createRound={createRound} getAllrounds={getAllrounds} />} />
            <Route path="responseForm" element={<ResponseForm user={user} round={round} response={response} currentRound={currentRound} giveAnswers={giveAnswers} />} />
            <Route path="myScore" element={<MyScore user={user} /*myscore={myscore}*/ getmyscore={getmyscore} />} />
            <Route path="hof" element={<HallOfFame user={user} hallofFame={hallofFame} />} />
          </Route>
          <Route path="/login" element={!loggedIn ? <LoginRoute login={handleLogin} /> : <Navigate replace to='/' />} />
        
        </Routes>
      </>
  );
}
export default App;

