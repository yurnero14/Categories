import React from 'react'
import { Table } from 'react-bootstrap'
import { useState } from "react";

const MyScore = (props) => {
  console.log(props);
  // const a = await props.getmyscore();
  // console.log("Finally", a);
  props.getmyscore().then((x)=>{
    console.log(x)
  })
 
  return (
    <>
    <p>{`${props.user.name}'s Scores for Each Category`}</p>
    <Table striped bordered>
      <thead>
        <tr>
          <th>Animals</th>
          <th>Countries</th>
          <th>Colors</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td>20</td>
        <td>30</td>
        <td>10</td>
        </tr>
      </tbody>
    </Table>
  </>
  )
}

export default MyScore