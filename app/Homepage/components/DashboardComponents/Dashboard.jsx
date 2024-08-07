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
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

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
    <div className="w-full">
      <div className="flex justify-left items-center mx-2 mb-2">
        <Card className="p-2 mr-2 rounded-xl">
          <p>
            <span className="font-bold text-base">Number of Projects:</span>{" "}
            {projectdata.length}
          </p>
        </Card>
        <NewChart data={data} columndata={columndata} />
        {/* <Filter data={data} setData={handleData} myData={myData} /> */}
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 md:m-2 h-full gap-2 mx-0">
        {finalChartData.map((chart) => (
          <Card key={chart.id} className="h-[300px] sm:h-[340px] md:h-[360px]">
            <CardHeader>
              <EditableChartName chart={chart} data={data} />
            </CardHeader>
            <Divider />
            <CardBody className="h-[400px] flex justify-center items-center overflow-hidden">
              <ChartComponent chartComponentData={chart} className="w-full" />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
