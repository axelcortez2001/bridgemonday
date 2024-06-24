import React, { useState, useEffect } from "react";
import Filter from "../FilterComponents/Filter";

import {
  allProjects,
  getAllCharts,
  getAllColumns,
  processedChartData,
} from "../functions/DashboardFunctions";

import NewChart from "./NewChart";
import ChartComponent from "./ChartComponent";
import EditableChartName from "./EditableChartName";

const Dashboard = ({ myData }) => {
  const [data, setData] = useState(myData);
  useEffect(() => {
    setData(myData);
  }, [myData]);
  const handleData = (newData) => {
    setData(newData);
  };
  // Get all projects data
  const projectdata = allProjects(data);
  // Get All columns
  const columndata = getAllColumns(data);
  const [selectedNewItem, setSelectedNewItem] = useState(null);
  //Get All Charts
  const chartData = getAllCharts(data);
  //process data for chart
  const finalChartData = processedChartData(chartData, projectdata, data);

  return (
    <div className='w-full max-h-screen overflow-y-auto flex flex-col p-2 gap-4'>
      <div className='flex flex-row w-full border p-2 gap-3'>
        <NewChart data={data} columndata={columndata} />
        <Filter data={data} setData={handleData} myData={myData} />
      </div>
      <div className='flex flex-wrap gap-3'>
        <div className='border h-32 w-60 bg-white rounded-xl'>
          <div className='w-full h-auto text-center p-2 border-b text-xl font-bold'>
            Number of Projects
          </div>
          <div className='w-full flex items-center justify-center text-4xl'>
            {projectdata.length}
          </div>
        </div>
        {finalChartData.map((chart) => (
          <div
            key={chart.id}
            className={`border h-auto  ${
              chart.type === "bar" || chart.type === "line"
                ? "w-[600px]"
                : "w-[500px]"
            } bg-white rounded-xl`}
          >
            <div className='w-full h-auto  p-2 border-b text-xl font-bold'>
              <EditableChartName chart={chart} data={data} />
            </div>
            <ChartComponent chartComponentData={chart} className='w-full' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
