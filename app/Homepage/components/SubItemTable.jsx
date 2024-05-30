import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  DragEndEvent,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableRow, preprocessData } from "./functions/tablefunctions";
import { selectedProjectAtom, updateSubItemData } from "../datastore";
import { dataColumns } from "./functions/hookfunctions";
import { mkConfig, generateCsv, download } from "export-to-csv";
const SubItemTable = ({ subItems, groupId, taskId }) => {
  const [projects, setProjects] = useAtom(selectedProjectAtom);
  const [data, setData] = useState(subItems);
  const [selectedRows, setSelectedRows] = useState([]);
  const columnData = dataColumns(projects.subColumns);
  useEffect(() => {
    const updateData = () => {
      setData(subItems);
    };
    updateData();
  }, [subItems]);
  const table = useReactTable({
    data: data || [],
    columns: columnData,
    getCoreRowModel: getCoreRowModel(),
    state: { selectedRows },
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
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
  const projectId = projects._id;
  //function to update subitemdata
  const updateTableData = useSetAtom(updateSubItemData);
  useEffect(() => {
    const updateData = () => {
      try {
        const type = "UpdateData";
        updateTableData(projectId, groupId, taskId, data, type);
      } catch (error) {
        console.log(error);
      }
    };
    updateData();
  }, [updateTableData, data]);

  //function to delete a row or whole table row
  const convertToArray = () => {
    return Object.keys(table.getState().rowSelection).map(Number);
  };
  const deleteSelectedRows = () => {
    if (window.confirm("Are you sure you want to delete") === true) {
      const selectedRowIds = convertToArray();
      const newData = data.filter(
        (row, index) => !selectedRowIds.includes(row.id)
      );
      console.log("New Table Data: ", newData);
      setData(newData);
      table.reset();
    }
  };

  const dataIds = React.useMemo(() => data?.map(({ id }) => id), [data]);
  console.log("SubData: ", data);
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex); // this is just a splice util
      });
    }
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  //exportfunction
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: "Subtable_data",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });
  const exportCsv = () => {
    const rowData = table.getRowModel().rows.map((row) => row.original);

    const keyMapping = {};
    columnData.forEach((col) => {
      if (
        col.accessorKey &&
        col.accessorKey !== "item" &&
        col.accessorKey !== "id"
      ) {
        keyMapping[col.accessorKey] = col.newItemName || col.key;
      }
    });
    const renameKeys = (obj, keyMap) => {
      return Object.keys(obj).reduce((acc, key) => {
        const newKey = keyMap[key] || key;
        acc[newKey] = obj[key];
        return acc;
      }, {});
    };
    const finalData = rowData.map((row) => renameKeys(row, keyMapping));
    const preprocessedData = preprocessData(finalData, convertToArray());
    const csv = generateCsv(csvConfig)(preprocessedData);
    download(csvConfig)(csv);
  };
  console.log("RowModel: ", table?.getRowModel());
  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className='w-full items-center justify-center'>
        {convertToArray().length > 0 && (
          <>
            <button
              onClick={deleteSelectedRows}
              className='mb-2 p-2 rounded-md bg-red-500 text-white'
            >
              Delete
            </button>
            <button
              onClick={exportCsv}
              className='mb-2 p-2 rounded-md bg-blue-500 text-white'
            >
              Export CSV
            </button>
          </>
        )}
        <table
          className='p-2 border border-gray-900 '
          style={{ width: table?.getTotalSize() }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className='px-6 py-3 border'
                    key={header.id}
                    style={{ position: "relative", maxwidth: header.getSize() }}
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
            {data !== undefined && (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table?.getRowModel().rows.map((row) => (
                  <DraggableRow
                    key={row.id}
                    row={row}
                    subItemData={data}
                    gId={groupId}
                  />
                ))}
              </SortableContext>
            )}
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

export default SubItemTable;
