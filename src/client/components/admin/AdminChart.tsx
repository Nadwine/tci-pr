import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Chart as Chartjs } from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { CategoryScale, Chart } from "chart.js";
import axios from "axios";
import User from "../../../database/models/user";

Chartjs.register(CategoryScale);

export const AdminChart = props => {
  const [users, setUsers] = useState<User[]>();
  const initGraph = async () => {
    const response = await axios.get("/api/users");

    const persons = response.data;
    setUsers(persons);
  };
  useEffect(() => {
    initGraph();
  }, []);

  const labels = users?.map(user => (user.accountType === "admin" ? "" : user.accountType)).filter(u => u !== "");
  return (
    <div className="d-flex w-100">
      <div className="card m-5" style={{ height: "490px", width: "910px", alignItems: "center" }}>
        <Pie
          data={{
            labels: [...new Set(labels)],
            datasets: [
              {
                label: "Users",
                data: [users?.filter(u => u.accountType === "tenant").length, users?.filter(u => u.accountType === "landlord").length],
                backgroundColor: [
                  "rgb(255, 99, 132)",
                  "rgb(54, 162, 235)",
                  "rgba(255, 159, 64)",
                  "rgb(255, 205, 86)",
                  "rgba(75, 192, 192)",
                  "rgba(153, 102, 255)",
                  "rgba(201, 203, 207)"
                ]
              }
            ]
          }}
        ></Pie>
      </div>
    </div>
  );
};

export default connect()(AdminChart);
