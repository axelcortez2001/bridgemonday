import { flexRender } from "@tanstack/react-table";
// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//functions for DnD based from tanstackDnD
//Cell Component
export const RowDragHandleCell = ({ rowId }) => {
  const { attributes, listeners } = useSortable({ id: rowId });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button
      {...attributes}
      {...listeners}
      className=' h-10 w-1  hover:w-2 hover:bg-gray-400'
    ></button>
  );
};

//Row Component
export const DraggableRow = ({ row }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform), // let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return (
    <tr ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{ width: cell.column.getSize() }}
          className={row.getIsSelected() ? "bg-gray-200" : ""}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
