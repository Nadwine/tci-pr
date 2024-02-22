import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Chart as Chartjs } from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { CategoryScale, Chart } from "chart.js";
import axios from "axios";

Chartjs.register(CategoryScale);

export const AdminChart = props => {
  const [users, setUsers] = useState();
  const initGraph = async () => {
    const response = await axios.get('/api/users')

    const persons = response.data
    setUsers(persons)

    const data = {
      labels: [...new Set(persons.map(person => person.accountType))],
      datasets: [{
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 159, 64)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(201, 203, 207)'
        ],
        data: []
      }]
    }
    // pushing data into the approprate label
    data.labels.forEach((label) => {
      const numberLabelMatches = persons.filter((person) => person.accountType === label )
      data.datasets[0].data.push(numberLabelMatches.length)
    })

    const config = {
      type: 'doughnut',
      data: data
    }

    const graph = new Chart(targetDiv.current, config)
    console.log('config', config)
  }

  useEffect(() => {
    initGraph()
  }, [])




  return (
    <div className="d-flex">
      <div className="card ms-5" style={{ height: "490px", width: "910px" }}>
        <Bar
          data={{
            labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            datasets: [
              {
                label: "New Users",
                data: [10, 20, 10, 30, 20, 40]
              }
            ]
          }}
        ></Bar>
      </div>
      <div className="card ms-5" style={{ height: "490px", width: "910px" }}>
        <Pie
          data={{
            labels: [...new Set(users?.map(user => user.accountType))],
            datasets: [
              {
                label: "New Users",
                data: [10, 20]
              }
            ]
          }}
        ></Pie>
      </div>
    </div>
  );
};

export default connect()(AdminChart);

const GenderPie = (props) => {
  const targetDiv = useRef()

  const initGraph = async () => {
    const response = await axios.get('/api/person')

    const persons = response.data

    const data = {
      labels: [...new Set(persons.map(person => person.sex))],
      datasets: [{
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 159, 64)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(201, 203, 207)'
        ],
        data: []
      }]
    }
    // pushing data into the approprate label
    data.labels.forEach((label) => {
      const numberLabelMatches = persons.filter((person) => person.sex === label)
      data.datasets[0].data.push(numberLabelMatches.length)
    })

    const config = {
      type: 'doughnut',
      data: data
    }

    // const graph = new Chart(targetDiv.current, config)
    // console.log('config', config)
  }

  useEffect(() => {
    initGraph()
  }, [])

  return (
    <div style={{ margin: '20px', backgroundColor: 'white', width: '510px', height: '550px' }} className='gender-pie shadow'>
      <h6 style={{paddingTop:'15px'}}>Reports by Gender</h6>
      <canvas style={{ width: '200px', height: '200px' }} ref={targetDiv} />
    </div>
  )
}
