import { useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Round from "../Round";

const CreateRoundForm = (props) => {
  console.log("round form props are:", props);
  // console.log("params are", props.params);
    const navi = useNavigate();
    // const location = useLocation();
    const [Category, setCategory] = useState(" ");
   
    const [Difficulty, setDifficulty] = useState(" ");
    console.log(Category, Difficulty);
   
    const handleSubmit = (event) => {
      
      event.preventDefault();
      // const params = {category: Category, difficulty:Difficulty};
      const ro={category: Category, difficulty:Difficulty};
      props.createRound(ro);
      navi('/responseForm');
    }
  
    return (
      <Form className="border border-primary rounded form-padding" onSubmit={handleSubmit}>
        <FormGroup className='mb-3'>
          <Form.Label>Category</Form.Label>
          <Form.Select aria-label='Category' onChange={(e)=>setCategory(e.target.value)}>
            <option value="Animals">Animals</option>
            <option value="Countries">Countries</option>
            <option value="Colors">Colors</option>
          </Form.Select>
        </FormGroup>
        
        <FormGroup className='mb-3'>
          <Form.Label>Difficulty</Form.Label>
          <Form.Select aria-label='Difficulty' onChange={(e)=>setDifficulty(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Form.Select>
        </FormGroup>
        <Link onClick={handleSubmit} to='/responseForm'>
          <Button className="mb-3" variant="primary" type="submit" >Create</Button>
        </Link>
        &nbsp;
        <Link to={'/'}> 
          <Button className="mb-3" variant="danger" >Cancel</Button>
        </Link>
      </Form>
    )
  }


export default CreateRoundForm;
