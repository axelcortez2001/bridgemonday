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

export const getAllItems = (chosenFunction, data, col, extension) => {
  let val = "";
  let result = [];
  if (chosenFunction === "IF" && col?.key === "number") {
    const key = col?.accessorKey;
    data.grouptask.forEach((groupTask) => {
      groupTask.task.forEach((task) => {
        try {
          const calculate = new Function(
            "value",
            `return value ${extension} ;`
          );
          val = calculate(task[key]);
        } catch (e) {
          val = "";
        } finally {
          if (task.hasOwnProperty(key)) {
            const taskData = task[key];
            if (taskData === "" || taskData === undefined) {
              result.push(null);
              return;
            }
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
  let val = "";
  let result = "";
  if (col?.key === "number") {
    const key = col?.accessorKey;

    try {
      const calculate = new Function("a", `return a ${extension} ;`);
      val = calculate(task[key]);
      if (val === false) {
        val = "No Value";
      }
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
export const getColumnArray = (data) => {
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

export const getSumValue = (id, task, operation, columnArray) => {
  let val = 0;
  let count = 0;
  let firstValueSet = false;
  let values = [];
  let frequency = {};
  columnArray?.forEach((col) => {
    const key = col?.accessorKey;
    if (task.hasOwnProperty(key)) {
      const value = task[key];
      const numValue = value === "" ? 0 : parseInt(value);
      switch (operation) {
        case "SUM":
          val += numValue;
          break;
        case "DIFFERENCE":
          if (!firstValueSet) {
            val = numValue;
            firstValueSet = true;
          } else {
            val -= numValue;
          }
          break;
        case "PRODUCT":
          if (!firstValueSet) {
            val = numValue;
            firstValueSet = true;
          } else {
            val *= numValue;
          }
          break;
        case "QUOTIENT":
          if (!firstValueSet) {
            val = numValue;
            firstValueSet = true;
          } else {
            val /= numValue;
          }
          break;
        case "AVERAGE":
          count++;
          val += numValue;
          break;
        case "MAX":
          values.push(numValue);
          val = Math.max(...values);
          break;
        case "MIN":
          values.push(numValue);
          val = Math.min(...values);
          break;
        case "MEAN":
          count++;
          val += numValue;
          break;
        case "MEDIAN":
          values.push(numValue);
          break;
        case "MODE":
          values.push(numValue);
          frequency[numValue] = (frequency[numValue] || 0) + 1;
          break;
        default:
          console.log("Unknown operation:", operation);
          break;
      }
    }
  });
  if (operation === "AVERAGE" || operation === "MEAN") {
    val = val / count;
  }
  if (operation === "MEDIAN") {
    values.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
      val = (values[mid - 1] + values[mid]) / 2;
    } else {
      val = values[mid];
    }
  }
  if (operation === "MODE") {
    let maxFrequency = 0;
    let modes = [];
    for (let num in frequency) {
      if (frequency[num] > maxFrequency) {
        maxFrequency = frequency[num];
        modes = [parseInt(num)];
      } else if (frequency[num] === maxFrequency) {
        modes.push(parseInt(num));
      }
    }
    val = modes.length === 1 ? modes[0] : modes;
  }
  return { value: val };
};
