import { statusesData, textItem } from "../../datastore";
import AddDropDown from "../otherComponents/AddDropDown";
import SelectCell from "../otherComponents/SelectCell";
import SelectHeader from "../otherComponents/SelectHeader";
import DateCell from "../tablecomponents/DateCell";
import DefaultDateCell from "../tablecomponents/DefaultDateCell";
import DefaultTimeCell from "../tablecomponents/DefaultTimeCell";
import DropDownCell from "../tablecomponents/DropDownCell";
import EditableCell from "../tablecomponents/EditableCell";
import EditableHeader from "../tablecomponents/EditableHeader";
import NumberCell from "../tablecomponents/NumberCell";
import OptionCell from "../tablecomponents/OptionCell";
import PersonCell from "../tablecomponents/PersonCell";
import { RowDragHandleCell } from "./tablefunctions";

export const checkHeader = (id) => {
  if (id !== undefined) {
    if (id === "Add") {
      return AddDropDown;
    } else if (id === "select") {
      return SelectHeader;
    }
  } else {
    return null;
  }
};

export const dataColumns = (columns) => {
  let dataCol = [];
  if (columns !== undefined) {
    columns.map((column) => {
      if (column.key === "select") {
        return dataCol.push({
          id: column.id,
          size: column.size,
          key: column.key,
          header: ({ table }) => (
            <input
              type='checkbox'
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          ),
          cell: ({ row }) => (
            <div className='w-full flex h-full items-center'>
              <RowDragHandleCell rowId={row.id} />
              <input
                className='border h-4 w-4'
                type='checkbox'
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
            </div>
          ),
        });
      } else if (column.key === "expander") {
        return dataCol.push({
          id: column.id,
          size: column.size,
          key: column.key,
          header: () => null,
          cell: ({ row }) => {
            return row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
              >
                {row.getIsExpanded() ? "👇" : "👉"}
              </button>
            ) : (
              "🔵"
            );
          },
        });
      } else if (column.key === "item") {
        return dataCol.push({
          id: column.id,
          size: column.size,
          key: column.key,
          header: column.header,
          accessorKey: column.accessorKey,
          cell: EditableCell,
        });
      } else if (column.key === "add") {
        return dataCol.push({
          id: column.id,
          size: column.size,
          key: column.key,
          header: AddDropDown,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "text") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: EditableCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "date") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: DateCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "people") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: PersonCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "defaultdate") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: DefaultDateCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "defaulttime") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: DefaultTimeCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "number") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: NumberCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "dropdown") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: DropDownCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "status") {
        //pending action
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.newItemName}
            />
          ),
          cell: OptionCell,
          accessorKey: column.accessorKey,
        });
      } else {
        return dataCol.push(column);
      }
    });
  }
  return dataCol;
};
