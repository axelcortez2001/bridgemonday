import React from "react";
import { RowDragHandleCell } from "../functions/tablefunctions";

const SelectCell = ({ row }) => {
  return (
    <div className='w-full flex h-full items-center'>
      <RowDragHandleCell rowId={row.id} />
      <input
        className='border h-4 w-4'
        type='checkbox'
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </div>
  );
};

export default SelectCell;
