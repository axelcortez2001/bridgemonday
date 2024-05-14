import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditableCell from "./tablecomponents/EditableCell";
import { useSetAtom } from "jotai";
import { updateGroupData } from "../datastore";

const columns = [
  {
    accessorKey: "item",
    header: "Item",
    cell: EditableCell,
  },
  {
    accessorKey: "managers",
    header: "Managers",
    cell: (props) => <p>{props.getValue().map((manager) => manager.name)}</p>,
  },
  {
    accessorKey: "processors",
    header: "Processor",
    cell: (props) => <p>{props.getValue().map((manager) => manager.name)}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "dateCompleted",
    header: "DateCompleted",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];

const Tasktable = ({ projectId, groupId, groupData }) => {
  const [data, setData] = useState(groupData);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
          )
        ),
    },
  });
  const updateTableData = useSetAtom(updateGroupData);
  console.log(groupId);
  useEffect(() => {
    const updateData = () => {
      try {
        updateTableData(projectId, groupId, data);
      } catch (error) {
        console.log(error);
      }
    };
    updateData();
  }, [data]);
  console.log("Data: ", data);
  return (
    <div className='w-full items-center justify-center'>
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
                  {header.column.columnDef.header}

                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  ></div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table?.getRowModel()?.rows.map((row) => (
            <tr key={row.id}>
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
            <button>+add item</button>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tasktable;
