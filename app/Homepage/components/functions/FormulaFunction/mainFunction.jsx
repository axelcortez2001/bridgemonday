export const getColforFormula = (data) => {
  let newData = [];
  data.map((column) => {
    if (
      column.key !== "select" &&
      column.key !== "expander" &&
      column.key !== "add" &&
      column.key !== "formula" &&
      column.key !== "item"
    ) {
      if (newData?.length > 0) {
        newData.push(column);
      } else {
        newData = [column];
      }
    }
  });
  return newData;
};

// export const getAllItems = (data, col) => {
//   const key = col?.accessorKey;
//   for (let groupTask of data.grouptask) {
//     for (let task of groupTask.task) {
//       if (task.hasOwnProperty(key)) {
//         return {
//           groupName: groupTask.groupName,
//           groupId: groupTask.id,
//           key: key,
//           keyData: task[key],
//         };
//       }
//     }
//   }
//   return null;
// };
export const getAllItems = (data, col, extension) => {
  const ex = ` === 21 && "Hakdog"`;
  let val = "";
  let result = [];
  if (col?.key === "number") {
    const key = col?.accessorKey;

    data.grouptask.forEach((groupTask) => {
      groupTask.task.forEach((task) => {
        try {
          const calculate = new Function("a", `return a ${extension} ;`);
          val = calculate(task[key]);
        } catch (e) {
          val = "";
        } finally {
          if (task.hasOwnProperty(key)) {
            result.push({
              groupName: groupTask.groupName,
              groupId: groupTask.id,
              key: key,
              keyData: task[key],
              value: val,
            });
          } else {
            result.push(null);
          }
        }
      });
    });
  }
  return result;
};
export const getFormulaValue = (id, task, col, extension) => {
  const ex = ` === 21 && "Hakdog"`;
  let val = "";
  let result = "";
  if (col?.key === "number") {
    const key = col?.accessorKey;

    try {
      const calculate = new Function("a", `return a ${extension} ;`);
      val = calculate(task[key]);
    } catch (e) {
      val = "No Value";
    } finally {
      if (task.hasOwnProperty(key)) {
        result = {
          key: key,
          keyData: task[key],
          value: val,
        };
      } else {
        result = "No Value";
      }
    }
  }
  return result;
};
