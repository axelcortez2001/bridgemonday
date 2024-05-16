import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditableCell from "./tablecomponents/EditableCell";
import { useAtom, useSetAtom } from "jotai";
import { selectedProject, updateGroupData, updateProject } from "../datastore";
import OptionCell from "./tablecomponents/OptionCell";
import DateCell from "./tablecomponents/DateCell";
import PersonCell from "./tablecomponents/PersonCell";
import IndeterminateCheckbox from "./functions/IndeterminateCheckbox";

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type='checkbox'
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        className='border w-full'
        type='checkbox'
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "item",
    header: "Item",
    cell: EditableCell,
  },
  {
    accessorKey: "managers",
    header: "Managers",
    cell: PersonCell,
  },
  {
    accessorKey: "processors",
    header: "Processor",
    cell: PersonCell,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: OptionCell,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: DateCell,
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: DateCell,
  },
  {
    accessorKey: "dateCompleted",
    header: "DateCompleted",
    cell: DateCell,
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: EditableCell,
  },
];

const Tasktable = ({ projectId, groupId, groupData }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState(groupData);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      selectedRows,
    },
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    enableRowSelection: true,
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
          )
        ),
    },
  });
  //update the all table data of an specfic table
  const updateTableData = useSetAtom(updateGroupData);
  useEffect(() => {
    const updateData = () => {
      try {
        console.log("trigger");
        const type = "UpdateData";
        updateTableData(projectId, groupId, data, type);
      } catch (error) {
        console.log(error);
      }
    };
    updateData();
  }, [data]);

  //function to delete a row or whole table row
  const convertToArray = () => {
    return Object.keys(table.getState().rowSelection).map(Number);
  };
  console.log("Selected ROws: ", convertToArray());
  const deleteSelectedRows = () => {
    if (window.confirm("Are you sure you want to delete") === true) {
      const selectedRowIds = convertToArray();
      const newData = data.filter(
        (row, index) => !selectedRowIds.includes(index)
      );
      console.log("New Table Data: ", newData);
      setData(newData);
      table.reset();
    }
  };
  //add new tablerow to an specific table
  const addNewRow = () => {
    try {
      const type = "Add Row";
      const updatedProject = updateTableData(projectId, groupId, data, type);
      console.log(updatedProject);
      setData(updatedProject);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Data: ", data);
  return (
    <div className='w-full items-center justify-center'>
      {convertToArray().length > 0 && (
        <button
          onClick={deleteSelectedRows}
          className='mb-2 p-2 rounded-md bg-red-500 text-white'
        >
          Delete
        </button>
      )}

      <table className='p-2 border border-gray-900 w-full'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className='px-6 py-3 border'
                  key={header.id}
                  style={{ position: "relative", width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      ></div>
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table?.getRowModel()?.rows.map((row) => (
            <tr
              key={row.id}
              className={row.getIsSelected() ? "bg-gray-200" : ""}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className='border'
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          <tr className='w-full flex items-center justify-center p-1 min-h-9 hover:cursor-pointer'>
            <button onClick={() => addNewRow()}>+add item</button>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tasktable;
