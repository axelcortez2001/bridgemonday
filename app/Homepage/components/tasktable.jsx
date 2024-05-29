import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditableCell from "./tablecomponents/EditableCell";
import { useAtom, useSetAtom } from "jotai";
import {
  selectedProject,
  selectedProjectAtom,
  updateGroupData,
  updateProject,
} from "../datastore";
import OptionCell from "./tablecomponents/OptionCell";
import DateCell from "./tablecomponents/DateCell";
import PersonCell from "./tablecomponents/PersonCell";
import DefaultDateCell from "./tablecomponents/DefaultDateCell";
import IndeterminateCheckbox from "./functions/IndeterminateCheckbox";
// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
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
import { mkConfig, generateCsv, download } from "export-to-csv";

const Tasktable = ({ projectId, groupId, groupData, columnData }) => {
  const [storeData, setStoreData] = useAtom(selectedProjectAtom);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState(groupData);
  const table = useReactTable({
    data,
    columns: columnData,
    getCoreRowModel: getCoreRowModel(),
    state: {
      selectedRows,
    },
    columnResizeMode: "onChange",
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    enableColumnResizing: true,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),

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
  const deleteSelectedRows = () => {
    if (window.confirm("Are you sure you want to delete") === true) {
      const selectedRowIds = convertToArray();
      const newData = data.filter(
        (row, index) => !selectedRowIds.includes(row.id)
      );
      setData(newData);
      table.reset();
    }
  };
  //add new tablerow to an specific table
  const addNewRow = async () => {
    try {
      const type = "Add Row";
      const updatedProject = await updateTableData(
        projectId,
        groupId,
        data,
        type
      );
      setData(updatedProject);
    } catch (error) {
      console.log(error);
    }
  };
  const dataIds = React.useMemo(() => data?.map(({ id }) => id), [data]);
  console.log("Data: ", data);
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
    filename: "table_data",
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
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} gId={groupId} />
              ))}
            </SortableContext>
            <tr className='w-full flex items-center justify-center p-1 min-h-9 hover:cursor-pointer'>
              <div>
                <button onClick={() => addNewRow()}>+add item</button>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

export default Tasktable;
