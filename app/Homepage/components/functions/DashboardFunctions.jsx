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
          acc[name] = { name: name, count: 0 };
        }
        projectdata.map((project) => {
          const peopleKeys = Object.keys(project).filter((key) =>
            key.startsWith("people")
          );
          peopleKeys.forEach((peopleKey) => {
            const peopleArray = project[peopleKey];
            if (peopleArray && Array.isArray(peopleArray)) {
              peopleArray.forEach((people) => {
                if (people.sub === userSub) {
                  acc[name].count += 1;
                }
              });
            }
          });
        });
        return acc;
      }, {});
    } else if (key.startsWith("date")) {
      newData = projectdata.reduce((acc, project) => {
        const dateKey = Object.keys(project).find((k) => k === key);
        const date = project[dateKey];
        // Check if the date is valid
        if (!date) {
          return acc;
        }
        const monthYear = new Date(date).toLocaleString("default", {
          year: "numeric",
          month: "long",
        });

        if (!acc[monthYear]) {
          acc[monthYear] = {};
        }

        const statusKeys = Object.keys(project).filter((k) =>
          k.startsWith("status")
        );

        statusKeys.forEach((statusKey) => {
          const status = project[statusKey];
          console.log("status", status);
          if (!acc[monthYear][status.text]) {
            acc[monthYear][status.text] = { count: 0, color: status.color };
          }
          acc[monthYear][status.text].count += 1;
        });

        return acc;
      }, {});
    } else {
      newData = projectdata.reduce((acc, project) => {
        const status = project[key];
        if (status) {
          if (!acc[status.text]) {
            acc[status.text] = { count: 0, color: status.color };
          }
          acc[status.text].count += 1;
        }
        return acc;
      }, {});
    }
    return { ...chart, newData };
  });
