import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register the components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const colorMapping = {
  "bg-a-blue": "#32449C",
  "bg-a-orange": "#EF8B16",
  "bg-a-green": "#01C875",
  "bg-a-red": "#E2445B",
  "bg-a-white": "#F9F9F9",
  "bg-a-black": "#393939",
  "bg-a-grey": "#D9D9D9",
};

const ChartComponent = ({ chart }) => {
  const labels = Object.keys(chart.data);
  const values = labels.map((label) => chart.data[label].count);
  const backgroundColors = labels.map(
    (label) => colorMapping[chart.data[label].color]
  );
  const hoverBackgroundColors = backgroundColors;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };
  const chartData = {
    labels,
    datasets: [
      {
        label: chart.title,
        data: values,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors,
      },
    ],
  };

  return (
    <div className='chart-container w-full' style={{ height: "400px" }}>
      {chart.type === "pie" && (
        <Pie data={chartData} options={options} className='w-full' />
      )}
      {chart.type === "bar" && <Bar data={chartData} options={options} />}
      {chart.type === "line" && <Line data={chartData} options={options} />}
    </div>
  );
};

export default ChartComponent;
