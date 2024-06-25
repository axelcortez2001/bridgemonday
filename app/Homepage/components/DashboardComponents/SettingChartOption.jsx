import React from "react";
import {
  Input,
  Skeleton,
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
import {
  allProjects,
  getAllColumns,
  getColumnForDateFiltering,
} from "../functions/DashboardFunctions";
import FilterValue from "../FilterComponents/FilterValue";

const SettingChartOption = ({
  chart,
  setChartSetting,
  data,
  setSelectedBase,
  selectedBase,
  value,
  setValue,
}) => {
  // Get All columns
  const columndata = getColumnForDateFiltering(data);
  // Get all projects data
  const projectdata = allProjects(data);
  const handleSetChartSetting = (text) => {
    const newChart = { ...chart, type: text };
    setChartSetting(newChart);
  };
  const handleFilterData = (base) => {
    const newChart = { ...chart, base: base.accessorKey };
    setSelectedBase(base.accessorKey);
    setChartSetting(newChart);
  };
  const handleAll = (text) => {
    const newChart = { ...chart, base: text };
    setSelectedBase("All");
    setChartSetting(newChart);
  };
  console.log("key: ", chart.key);
  console.log("columndata: ", columndata);
  const buttonTitle = columndata.find(
    (col) => col.accessorKey === selectedBase
  );
  console.log("chart: ", chart);
  console.log("projectdata: ", projectdata);
  return (
    <div className='flex flex-col h-full gap-2'>
      <div className='w-full'>Chart Type</div>
      <div className='flex flex-col h-full gap-3'>
        <div className='flex flex-wrap gap-2'>
          <div
            className='border rounded-md p-2 hover:cursor-pointer'
            onClick={() => handleSetChartSetting("pie")}
          >
            Pie
          </div>
          <div
            className='border rounded-md p-2 hover:cursor-pointer'
            onClick={() => handleSetChartSetting("doughnut")}
          >
            Doughnut
          </div>
          <div
            className='border rounded-md p-2 hover:cursor-pointer'
            onClick={() => handleSetChartSetting("line")}
          >
            Line
          </div>

          <div
            className='border rounded-md p-2 hover:cursor-pointer'
            onClick={() => handleSetChartSetting("bar")}
          >
            Bar
          </div>
          <div
            className='border rounded-md p-2 hover:cursor-pointer'
            onClick={() => handleSetChartSetting("verticalbar")}
          >
            Vertical Bar
          </div>
        </div>
        <div>
          <p>Filtering</p>
          <div className='flex flex-row items-center gap-3 w-full'>
            <p>Base: </p>

            <div className='w-full h-full border rounded-md items-center'>
              <Dropdown className='w-full min-w-[0px] '>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    disableAnimation
                    disableRipple
                    className='w-full h-full'
                  >
                    {selectedBase === null
                      ? "Select Item"
                      : buttonTitle
                      ? buttonTitle.newItemName
                      : "All"}
                  </Button>
                </DropdownTrigger>
                {(chart.key === "people" || chart.key.startsWith("date")) && (
                  <DropdownMenu variant='faded' aria-label='Chart Option'>
                    <DropdownItem key='All' onClick={() => handleAll("All")}>
                      All
                    </DropdownItem>
                    {columndata.map((col) => (
                      <DropdownItem
                        key={col.newItemName}
                        onClick={() => handleFilterData(col)}
                      >
                        {col.newItemName}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                )}
              </Dropdown>
            </div>
          </div>
          <div className='flex flex-row items-center gap-3 w-full'>
            <p>Value: </p>
            <FilterValue
              data={data}
              columnValue={buttonTitle}
              value={value}
              setValue={setValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingChartOption;
