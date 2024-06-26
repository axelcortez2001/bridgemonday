import { statusesData, textItem } from "../../datastore";
import AddDropDown from "../otherComponents/AddDropDown";
import AddSubItemDropDown from "../otherComponents/AddSubItemDropDown";
import SelectCell from "../otherComponents/SelectCell";
import SelectHeader from "../otherComponents/SelectHeader";
import DateCell from "../tablecomponents/DateCell";
import DefaultDateCell from "../tablecomponents/DefaultDateCell";
import DefaultTimeCell from "../tablecomponents/DefaultTimeCell";
import DropDownCell from "../tablecomponents/DropDownCell";
import EditableCell from "../tablecomponents/EditableCell";
import EditableHeader from "../tablecomponents/EditableHeader";
import EditableSubHeader from "../tablecomponents/EditableSubHeader";
import FormulaCell from "../tablecomponents/FormulaCell";
import NumberCell from "../tablecomponents/NumberCell";
import OptionCell from "../tablecomponents/OptionCell";
import PersonCell from "../tablecomponents/PersonCell";
import { RowDragHandleCell } from "./tablefunctions";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

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
                className='border h-[12px] w-full'
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
                className=' flex justify-center w-full'
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
              >
                {row.getIsExpanded() ? (
                  <MdKeyboardArrowDown size={28} />
                ) : (
                  <MdKeyboardArrowRight size={28} />
                )}
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
      } else if (column.key === "addsub") {
        return dataCol.push({
          id: column.id,
          size: column.size,
          key: column.key,
          header: AddSubItemDropDown,
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: EditableCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "subtext") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: DateCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "subdate") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: PersonCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "subpeople") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: DefaultDateCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "subdefaultdate") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: DefaultTimeCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "subdefaulttime") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: NumberCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "subnumber") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: DropDownCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "subdropdown") {
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
            />
          ),
          cell: DropDownCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "formula") {
        //pending action
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
            />
          ),
          cell: FormulaCell,
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
              accessorKey={column.accessorKey}
            />
          ),
          cell: OptionCell,
          accessorKey: column.accessorKey,
        });
      } else if (column.key === "substatus") {
        //pending action
        return dataCol.push({
          size: column.size,
          key: column.key,
          newItemName: column.newItemName,
          header: (
            <EditableSubHeader
              data={column.newItemName}
              accessorKey={column.accessorKey}
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
