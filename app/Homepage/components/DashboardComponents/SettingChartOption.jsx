import React from "react";

const SettingChartOption = ({ chart, setChartSetting }) => {
  const handleSetChartSetting = (text) => {
    const newChart = { ...chart, type: text };
    setChartSetting(newChart);
  };
  return (
    <div className='flex flex-col h-full gap-2'>
      <div className='w-full'>Chart Type</div>
      <div className='flex flex-col h-full gap-3'>
        <div>
          <p>Pie</p>
          <div className='flex flex-row gap-2'>
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
          </div>
        </div>
        <div>
          <p>Line</p>
          <div
            className='border rounded-md p-2 hover:cursor-pointer'
            onClick={() => handleSetChartSetting("line")}
          >
            Line
          </div>
        </div>
        <div>
          <p>Bar</p>
          <div className='flex flex-row gap-2'>
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
        </div>
      </div>
    </div>
  );
};

export default SettingChartOption;
