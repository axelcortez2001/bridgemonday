import React, { useEffect, useState } from "react";

const EditableCell = ({ getValue }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className='border p-2 text-wrap w-full'
    />
  );
};

export default EditableCell;
