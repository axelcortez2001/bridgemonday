import React, { useEffect, useState } from "react";

const NumberCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <input
      value={value}
      onBlur={onBlur}
      onChange={(e) => setValue(e.target.value)}
      type='Number'
      className='p-2 text-wrap w-full hover:bg-gray-200 h-full'
    />
  );
};

export default NumberCell;
