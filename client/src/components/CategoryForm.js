import {Button, Form} from "react-bootstrap";
import {useState} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function generateRandomLetter(){
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return letters[Math.floor(Math.random() * letters.length)];
  }

function getstartime(){
    return Math.floor(Date.now() / 1000)
}

function setTimeandLetter(){
    const a = generateRandomLetter();
    const b = getstartime();
    const obj={
        letter: a,
        startime: b,

    }
    return obj; 
}
function CategoryForm(props){
    const navigate = useNavigate();
    const location = useLocation();

    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    //temporary states
    const [letter, setLetterandstartTime] = useState({letter: "", startime:""});
    const [startime, setStartime]=useState("");
    const isAdding = location.state ? false : true;
    console.log(location.state);
    //category kay props hongy 
    const handleSubmit=(event) =>{
        event.preventDefault();
        const cat = {category: category, difficulty: difficulty, letter: letter, startime:startime};
        if(isAdding){
            props.addCategory(cat);
        }
        navigate('/');
    }
    
    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
                <Form.Label>Category</Form.Label>
                <Form.Select aria-label ="Category Select" onChange={(e)=>setCategory(e.target.value)}>
                    <option>Select Category</option>
                    <option value = "Animals">Animals</option>
                    <option value = "Countries">Countries</option>
                    <option value = "Colors">Colors</option> 
                </Form.Select>

            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select aria-label = "Difficulty select" onChange={(e)=>setDifficulty(e.target.value)}>
                    <option>Select Difficulty</option>
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                </Form.Select>
            </Form.Group>
            <Button className = "mt-1" variant="primary" type="submit" onClick={(e)=>setLetterandstartTime(setTimeandLetter())}>
            Create Round </Button>
            <Link to = '/'>
            <Button className = "mt-1" variant="danger" > Cancel </Button>
            </Link>


        </Form>
    )
    //Either we gonna implement the scoring strat on front end or we gonna find a way to work around isLoggedin 
}

export default CategoryForm;