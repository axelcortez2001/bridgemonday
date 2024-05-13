"use client";
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditableCell from "@/app/Mainpage/components/EditableCell";
import OptionCell from "@/app/Mainpage/components/OptionCell";

const columns = [
  {
    accessorKey: "item",
    header: "Item",
    cell: EditableCell,
  },
  {
    accessorKey: "supervisor",
    header: "Supervisor",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "developers",
    header: "Developers",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: OptionCell,
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
const Maintable = ({ tableData }) => {
  const [data, setData] = useState(tableData);
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

  console.log(data);
  return (
    <div className='w-full items-center justify-center'>
      <table className='p-2 border border-gray-900'>
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
          {table.getRowModel().rows.map((row) => (
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

export default Maintable;
