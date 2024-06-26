export const getColforFormula = (data) => {
  let newData = [];
  data.map((column) => {
    if (
      column.key !== "select" &&
      column.key !== "expander" &&
      column.key !== "add" &&
      column.key !== "formula"
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
