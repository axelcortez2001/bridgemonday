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
        column.key.toLocaleLowerCase() === "dropdown" ||
        column.key.toLocaleLowerCase() === "date"
      ) {
        columnData.push(column);
      }
    });
  }
  return columnData;
};
export const getColumnForDateFiltering = (data) => {
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

export const generateDateChartData = (chart, labels, colorMapping) => {
  const statusLabels = [
    ...new Set(
      Object.values(chart.newData).flatMap((statuses) => Object.keys(statuses))
    ),
  ];
  const datasets = statusLabels.map((statusLabel) => {
    const data = labels.map(
      (label) => chart.newData[label][statusLabel]?.count || ""
    );
    const col = labels
      .map((label) => chart.newData[label][statusLabel]?.color || "")
      .filter((color) => color !== "");

    const firstValidColor = col.find((color) => colorMapping[color]) || "";
    const backgroundColor = firstValidColor
      ? colorMapping[firstValidColor]
      : "#D9D9D9";

    return {
      label: statusLabel,
      data,
      backgroundColor,
    };
  });

  const allValues = datasets.flatMap((dataset) => dataset.data);
  const maxValue = Math.max(...allValues.filter((val) => val !== ""));

  return {
    labels,
    datasets,
    maxValue,
  };
};

export const processedChartData = (chartData, projectdata, data) =>
  chartData.map((chart) => {
    const key = chart.key;
    let newData = {};
    const chartValues = chart.chartValue || [];
    console.log("projectdata: ", projectdata);
    // Filter projectdata based on date range first
    // Filter newData based on chart.startDate and chart.endDate
    if (chart.startDate && chart.endDate) {
      // Filter projectdata based on date range first
      projectdata = projectdata.filter((project) => {
        const dateKey = Object.keys(project).find((k) => k.startsWith("date"));
        if (!dateKey) {
          return false; // Skip entries without a date key
        }
        const projectDate = new Date(project[dateKey]);
        const startDate = new Date(chart.startDate);
        const endDate = new Date(chart.endDate);
        return projectDate >= startDate && projectDate <= endDate;
      });
    }
    if (key === "groupChart") {
      newData = data?.grouptask?.reduce((acc, group) => {
        const groupName = group.groupName;
        const taskCount = group.task.length;
        if (!acc[groupName]) {
          acc[groupName] = { count: 0 };
        }
        acc[groupName].count += taskCount;
        return acc;
      }, {});
    } else if (key === "people") {
      newData = data?.organizer?.reduce((acc, user) => {
        const name = user.name;
        const userSub = user.sub;
        if (!acc[name]) {
          acc[name] = {};
        }
        projectdata.forEach((project) => {
          const peopleKeys = Object.keys(project).filter((key) =>
            key.startsWith("people")
          );
          peopleKeys.forEach((peopleKey) => {
            const peopleArray = project[peopleKey];
            if (peopleArray && Array.isArray(peopleArray)) {
              peopleArray.forEach((people) => {
                if (people.sub === userSub) {
                  const statusKeys = Object.keys(project).filter((key) => {
                    if (
                      chart?.base?.startsWith("status") ||
                      chart?.base?.startsWith("dropdown")
                    ) {
                      return key === chart.base;
                    } else {
                      return key.startsWith("status");
                    }
                  });
                  statusKeys.forEach((statusKey) => {
                    const status = project[statusKey];
                    if (!acc[name][status?.text]) {
                      acc[name][status?.text] = {
                        count: 0,
                        color: status?.color,
                      };
                      acc[name][status?.text].count += 1;
                    }
                  });
                }
              });
            }
          });
        });

        return filterAcc(acc);
      }, {});
    } else if (key.startsWith("date")) {
      const beforeData = projectdata.reduce((acc, project) => {
        const dateKey = Object.keys(project).find((k) => k === key);
        const date = project[dateKey];
        if (!date) {
          return acc;
        }

        // Determine the date format based on chartByDate
        let dateFormatOptions;
        if (chart?.chartByDate === "byDay") {
          dateFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
        } else if (chart?.chartByDate === "byMonth") {
          dateFormatOptions = { year: "numeric", month: "long" };
        } else if (chart?.chartByDate === "byYear") {
          dateFormatOptions = { year: "numeric" };
        } else {
          // Default to byDay if not specified
          dateFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
        }

        const formattedDate = new Date(date).toLocaleString(
          "default",
          dateFormatOptions
        );

        if (!acc[formattedDate]) {
          acc[formattedDate] = {};
        }

        const statusKeys = Object.keys(project).filter((k) => {
          if (
            chart?.base?.startsWith("status") ||
            chart?.base?.startsWith("dropdown")
          ) {
            return k === chart.base;
          } else {
            return k.startsWith("status");
          }
        });
        statusKeys.forEach((statusKey) => {
          const status = project[statusKey];
          if (!acc[formattedDate][status.text]) {
            acc[formattedDate][status.text] = { count: 0, color: status.color };
          }
          acc[formattedDate][status.text].count += 1;
        });

        return acc;
      }, {});
      const sortedData = Object.keys(beforeData)
        .map((dateStr) => ({
          dateStr,
          date: new Date(dateStr),
          data: beforeData[dateStr],
        }))
        .sort((a, b) => a.date - b.date)
        .reduce((acc, { dateStr, data }) => {
          acc[dateStr] = data;
          return acc;
        }, {});
      newData = sortedData;
    } else {
      newData = projectdata.reduce((acc, project) => {
        const status = project[key];
        if (status && status?.length !== 0) {
          if (!acc[status.text]) {
            acc[status.text] = { count: 0, color: status.color };
          }
          acc[status.text].count += 1;
        }
        return acc;
      }, {});
    }

    if (key !== "groupChart") {
      newData = filterByChartValue(newData, chartValues, chart);
      console.log("Filter: ", newData);
    }

    return { ...chart, newData };
  });
const filterByChartValue = (data, chartValues, chart) => {
  if (chartValues.length === 0) {
    return data;
  }
  const filteredData = {};
  if (chart.key === "people" || chart.key.startsWith("date")) {
    Object.keys(data).forEach((key) => {
      const values = data[key];
      filteredData[key] = {};
      Object.keys(values).forEach((valueKey) => {
        if (chartValues.some((value) => value.text === valueKey)) {
          filteredData[key][valueKey] = values[valueKey];
        }
      });
    });
    return filteredData;
  } else {
    Object.keys(data).forEach((key) => {
      if (
        chartValues.some(
          (value) =>
            value?.text?.toLocaleLowerCase() === key.toLocaleLowerCase()
        )
      ) {
        filteredData[key] = data[key];
      }
    });
  }
  return filteredData;
};
// Function to filter out no data
const filterAcc = (acc) => {
  return Object.keys(acc).reduce((filteredAcc, key) => {
    const statuses = acc[key];
    const nonEmptyStatuses = Object.keys(statuses).filter(
      (status) => statuses[status].count > 0
    );

    if (nonEmptyStatuses.length > 0) {
      filteredAcc[key] = statuses;
    }

    return filteredAcc;
  }, {});
};
const filterDataByDateRange = (data, startDate, endDate) => {
  const filteredData = {};
  Object.keys(data).forEach((key) => {
    // Assuming key is a date string or identifier
    if (
      new Date(key) >= new Date(startDate) &&
      new Date(key) <= new Date(endDate)
    ) {
      filteredData[key] = data[key];
    }
  });
  return filteredData;
};
