export const allProjects = (data) => {
  let projectdata = [];
  if (data && data !== undefined) {
    data?.grouptask?.map((grouptask) => {
      grouptask?.task?.map((task) => {
        projectdata.push(task);
      });
    });
  }
  return projectdata;
};
export const getAllCharts = (data) => {
  let chartData = [];
  if (data && data !== undefined) {
    data?.charts?.map((chart) => chartData.push(chart));
  }
  return chartData;
};
export const getAllColumns = (data) => {
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
