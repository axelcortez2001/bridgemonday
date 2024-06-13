import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
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
import { Button } from "@nextui-org/react";
import { MdOutlineDelete } from "react-icons/md";
import { CiExport } from "react-icons/ci";

const SubItemTable = ({ subItems, groupId, taskId, setData }) => {
  const [projects, setProjects] = useAtom(selectedProjectAtom);
  const [data, setSubData] = useState(subItems);
  const [selectedRows, setSelectedRows] = useState([]);
  const [initialColumns, setInitialColumns] = useState(projects.subColumns);
  const [columnValues, setColumnValues] = useState(
    dataColumns(projects.subColumns)
  );
  useEffect(() => {
    if (
      JSON.stringify(projects.subColumns) !== JSON.stringify(initialColumns)
    ) {
      console.log("Triggerasdas");
      setInitialColumns(projects.subColumns);
      setColumnValues(dataColumns(projects.subColumns));
    }
  }, [projects.subColumns]);

  useEffect(() => {
    const updateData = () => {
      if (JSON.stringify(subItems) !== JSON.stringify(data)) {
        setSubData(subItems);
        setData(subItems);
      }
    };
    updateData();
  }, [subItems]);
  const table = useReactTable({
    data: data || [],
    columns: columnValues,
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
    const updateData = async () => {
      try {
        console.log("Trigger subtable");
        const type = "UpdateData";
        const status = await updateTableData(
          projectId,
          groupId,
          taskId,
          data,
          type
        );
        if (!status && status.success === false) {
          alert("Error updating subtable");
        }
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
    columnValues.forEach((col) => {
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
      <div className='w-full items-center justify-center py-[8px] border-l-1 pl-[8px]'>
        {convertToArray().length > 0 && (
          <>
            <div
              className={`fixed bg-a-white rounded-[12px] left-[50%] bottom-[8px]`}
            >
              <div className={`px-[4px] py-[2px]`}>
                <Button
                  className='w-[156px] justify-start font-helvetica text-[14px] text-a-blue border-r-1'
                  radius='none'
                  variant='light'
                  startContent={<CiExport className='size-[48%]' />}
                  onPress={exportCsv}
                >
                  Export CSV
                </Button>
                <Button
                  className='w-[156px] justify-start font-helvetica text-[14px] text-a-red'
                  radius='none'
                  variant='light'
                  startContent={<MdOutlineDelete className='size-[48%]' />}
                  onPress={deleteSelectedRows}
                >
                  Delete Sub Task
                </Button>
              </div>
            </div>
          </>
        )}
        <table
          className='p-2 border border-a-grey'
          style={{ width: table?.getTotalSize() }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className='p-[5px] border-1 border-a-grey h-[52px] min-h-[0px] min-w-[80px]'
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
          <tbody className='h-[52px]'>
            {data !== undefined && (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table?.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} gId={groupId} />
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
