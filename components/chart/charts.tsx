import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const lineData = {
  labels: [
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
  ],
  datasets: [
    {
      label: "Total Revenue",
      data: [20, 30, 50, 40, 60, 80, 70, 60, 50, 40, 60, 70],
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      tension: 0.4,
    },
    {
      label: "Total Sales",
      data: [10, 20, 30, 40, 50, 60, 70, 50, 40, 30, 50, 60],
      fill: true,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  datasets: [
    {
      label: "Sales",
      data: [60, 40, 50, 70, 80, 40, 90],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
    {
      label: "Revenue",
      data: [80, 60, 70, 90, 100, 60, 110],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

function Charts() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white shadow p-4 rounded-lg">
        <Line data={lineData} />
      </div>
      <div className="bg-white shadow p-4 rounded-lg">
        <Bar data={barData} />
      </div>
    </div>
  );
}

export default Charts;
