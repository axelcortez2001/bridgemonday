import React, { useEffect, useState } from "react";

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    console.log(row.index);
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
      className='border p-2 text-wrap w-full'
    />
  );
};

export default EditableCell;
