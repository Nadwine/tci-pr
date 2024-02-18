import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Chart as Chartjs } from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";

Chartjs.register(CategoryScale);

export const AdminChart = props => {
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
            labels: ["Total $ made", "Expenses"],
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
