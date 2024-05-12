"use client";
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DATA from "./tablestore";
import EditableCell from "./components/EditableCell";
import OptionCell from "./components/OptionCell";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

const columns = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   size: 200,
  //   cell: (props) => <p>{props.getValue()}</p>,
  // },
  {
    accessorKey: "name",
    header: "NAME",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "task",
    header: "TASK",
    size: 200,
    cell: EditableCell,
  },
  { accessorKey: "status", header: "STATUS", size: 200, cell: OptionCell },
  {
    accessorKey: "age",
    header: "AGE",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "city",
    header: "CITY",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];

const Mainpage = () => {
  const [data, setData] = useState(DATA);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
  });
  console.log(table.getHeaderGroups());
  console.log("row model:", table.getRowModel());
  return (
    <div className='flex items-center justify-center'>
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
        </tbody>
      </table>
    </div>
  );
};

export default Mainpage;
