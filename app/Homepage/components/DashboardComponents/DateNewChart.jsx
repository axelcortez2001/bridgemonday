import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Filter from "../FilterComponents/Filter";
import FilterColumn from "../FilterComponents/FilterColumn";
import FilterCondition from "../FilterComponents/FilterCondition";
import FilterValue from "../FilterComponents/FilterValue";
import { allProjects, getAllCharts } from "../functions/DashboardFunctions";
const DateNewChart = ({ myData }) => {
  const [data, setData] = useState(myData);
  const handleData = (newData) => {
    console.log("NewData: ", newData);
    setData(newData);
  };
  const getAllColumns = () => {
    let columnData = [];
    if (data && data !== undefined) {
      data?.columns?.map((column) => {
        if (
          column.key.toLocaleLowerCase() === "status" ||
          column.key.toLocaleLowerCase() === "dropdown"
        ) {
          columnData.push(column);
        }
      });
    }
    return columnData;
  };
  const [selectedColumn, setSelectedColumn] = useState("Select Item");
  const [condition, setCondition] = useState("Condition");
  const [columnValue, setColumnValue] = useState(null);
  const [value, setValue] = useState([]);

  const handleColumnValue = (col) => {
    setColumnValue(col);
  };
  const handleSelectedColumn = (col) => {
    setSelectedColumn(col);
  };
  const handleCondition = (con) => {
    setCondition(con);
  };
  const handleValue = (val) => {
    const exists = value.some((item) => item.text === val.text);

    const newValue = exists
      ? value.filter((item) => item.text !== val.text)
      : [...value, val];

    setValue(newValue);
  };
  const handleFilter = () => {
    if (value && value.length > 0) {
      const columnKey = columnValue?.accessorKey;
      const updatedProject = {
        ...myData,
        grouptask: myData?.grouptask?.map((grouptask) => {
          return {
            ...grouptask,
            task: grouptask?.task?.filter((task) => {
              const taskColumnValue = task[columnKey]?.text.toLocaleLowerCase();
              // console.log("ColumnKey: " + columnKey);
              console.log("value: ", value);
              console.log("text value: ", taskColumnValue);
              console.log("condition: ", condition);
              // Apply filter based on the condition type
              if (condition === "is") {
                return value.some((val) =>
                  taskColumnValue?.includes(val?.text?.toLocaleLowerCase())
                ); //
              } else if (condition === "is not") {
                return !value.some((val) =>
                  taskColumnValue?.includes(val?.text?.toLocaleLowerCase())
                );
              } else {
                return false;
              }
            }),
          };
        }),
      };
      console.log("Updated: ", updatedProject);
      setData(updatedProject);
    } else {
      setData(myData);
    }
  };

  useEffect(() => {
    if (value.length > 0 && condition !== "Condition") {
      handleFilter();
    }
  }, [value, condition]);
  const chartData = getAllCharts(myData);
  const projectdata = allProjects(myData);
  console.log("ProjectData: ", projectdata);
  const processedChartData = chartData.map((chart) => {
    console.log("Chart", chart);
    const key = chart.key;
    let newData = {};
    if (key === "date") {
      newData = projectdata.reduce((acc, project) => {
        const dateKey = Object.keys(project).find((k) => k.startsWith("date"));
        const date = project[dateKey];
        const monthYear = new Date(date).toLocaleString("default", {
          year: "numeric",
          month: "long",
        });

        if (!acc[monthYear]) {
          acc[monthYear] = { count: 0 };
        }
        acc[monthYear].count += 1;

        return acc;
      }, {});
    }
  });
  console.log("ProcessData: ", processedChartData);
  return (
    <div className='flex flex-col w-full'>
      <div className=' w-full  flex flex-row'>
        <div className='border rounded-md min-w-32'>
          <FilterColumn
            data={data}
            setSelectedColumn={handleSelectedColumn}
            selectedColumn={selectedColumn}
            setColumnValue={handleColumnValue}
          />
        </div>
        <div className='border rounded-md min-w-24 flex items-center justify-center text-sm'>
          <FilterCondition
            selectedColumn={selectedColumn}
            condition={condition}
            setCondition={handleCondition}
            columnValue={columnValue}
          />
        </div>
        <div className='border rounded-md w-full flex items-center justify-center text-sm'>
          <FilterValue
            columnValue={columnValue}
            data={data}
            value={value}
            setValue={handleValue}
          />
        </div>
      </div>
      heyy
    </div>
  );
};

export default DateNewChart;
