import React from "react";

const SelectHeader = ({ table }) => {
  return (
    <input
      type='checkbox'
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  );
};

export default SelectHeader;
