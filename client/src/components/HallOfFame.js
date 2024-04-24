import React from 'react'
import { Table } from 'react-bootstrap'

const HallOfFame = (props) => {
  console.log(props)
  props.hallofFame().then((x)=>{
    console.log(x);
  })
  return (
    <>
    <h1>Hall Of Fame</h1>
    <p>The Leaders of Each Category</p>
    <Table striped bordered>
      <thead>
        <tr>
          <th>🏆</th>
          <th>Category</th>
          <th>User</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>🐅</td>
          <td>Animals</td>
          <td>Mario</td>
          <td>20</td>
        </tr>
        <tr>
          <td>🌈</td>
          <td>Colors</td>
          <td>Mario</td>
          <td>10</td>
        </tr>
        <tr>
          <td>🌎</td>
          <td>Countries</td>
          <td>Arteezy</td>
          <td>60</td>
        </tr>
      </tbody>
    </Table>
  </>
  )
}

export default HallOfFame