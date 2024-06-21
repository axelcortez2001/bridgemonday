import React from "react";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
// Register the components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartDataLabels
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
const SettingChartComponent = ({ chart }) => {
  const labels = Object.keys(chart.data);
  const values = labels.map((label) => chart.data[label].count);
  const maxValue = Math.max(...values);
  const backgroundColors = labels.map(
    (label) => colorMapping[chart.data[label].color]
  );
  const hoverBackgroundColors = backgroundColors;
  const indexAxis = chart.type === "verticalbar" ? "y" : "x";
  const options = {
    indexAxis: indexAxis,
    responsive: true,
    elements: {
      bar: {
        borderRadius: 15,
        borderWidth: 0.7,
      },
    },
    maintainAspectRatio: true,
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        display:
          chart.type !== "bar" &&
          chart.type !== "line" &&
          chart.type !== "verticalbar",
        position: "right",
        labels: {
          pointStyle: "circle",
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
      datalabels: {
        display: chart.type !== "pie" && chart.type !== "doughnut",
        anchor: "end",
        align: "end",
        color: "black",
        font: {
          weight: "bold",
        },
        formatter: (value, context) => {
          return value;
        },
      },
    },
    scales: {
      y: {
        display: chart.type !== "pie" && chart.type !== "doughnut",
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        suggestedMax: maxValue + 1,
      },
      x: {
        display: chart.type !== "pie" && chart.type !== "doughnut",
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        suggestedMax: maxValue + 1,
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
    <>
      {chart.type === "pie" && (
        <div
          className='chart-container w-full'
          style={{ height: "500px", width: "full" }}
        >
          <Pie data={chartData} options={options} className='w-full' />
        </div>
      )}
      {chart.type === "doughnut" && (
        <div
          className='chart-container w-full'
          style={{ height: "500px", width: "full" }}
        >
          <Doughnut data={chartData} options={options} className='w-full' />
        </div>
      )}
      {chart.type === "bar" && <Bar data={chartData} options={options} />}
      {chart.type === "verticalbar" && (
        <Bar data={chartData} options={options} />
      )}
      {chart.type === "line" && <Line data={chartData} options={options} />}
    </>
  );
};

export default SettingChartComponent;
