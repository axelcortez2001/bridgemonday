import React, { useState } from "react";
import Filter from "../FilterComponents/Filter";

import {
  allProjects,
  getAllCharts,
  getAllColumns,
} from "../functions/DashboardFunctions";
import NewChart from "./NewChart";
import ChartComponent from "./ChartComponent";

const Dashboard = ({ data }) => {
  // Get all projects data
  const projectdata = allProjects(data);
  // Get All columns
  const columndata = getAllColumns(data);
  const [selectedNewItem, setSelectedNewItem] = useState(null);
  //Get All Charts
  const chartData = getAllCharts(data);
  console.log("Chart Data: ", chartData);
  console.log("All Projects: ", projectdata);
  console.log("Columns: ", columndata);
  const processedChartData = chartData.map((chart) => {
    const key = chart.key;
    const data = projectdata.reduce((acc, project) => {
      const status = project[key];
      if (status) {
        if (!acc[status.text]) {
          acc[status.text] = { count: 0, color: status.color };
        }
        acc[status.text].count += 1;
      }
      return acc;
    }, {});
    return { ...chart, data };
  });
  return (
    <div className='w-full max-h-screen overflow-y-auto flex flex-col p-2 gap-4'>
      <div className='flex flex-row w-full border p-2 gap-3'>
        <NewChart data={data} columndata={columndata} />
        <Filter data={data} />
      </div>
      <div className='flex flex-wrap'>
        <div className='border h-32 w-60'>
          <div className='w-full h-auto text-center p-2 border-b text-xl font-bold'>
            Number of Projects
          </div>
          <div className='w-full flex items-center justify-center text-4xl'>
            {projectdata.length}
          </div>
        </div>
      </div>
      <div className='flex flex-wrap'>
        {processedChartData.map((chart) => (
          <div
            key={chart.id}
            className={`border h-auto   m-2 ${
              chart.type === "bar" ? "w-full" : "w-auto"
            }`}
          >
            <div className='w-full h-auto text-center p-2 border-b text-xl font-bold'>
              {chart.title}
            </div>
            <ChartComponent chart={chart} className='w-full' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
