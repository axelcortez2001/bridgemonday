import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@nextui-org/react";
const TableFooter = ({ column, data }) => {
  const [formulaState, setFormulaState] = useState("Sum");
  const totalRow = () => {
    const totals = () => {
      if (column?.accessorKey?.startsWith("number")) {
        let values = data.map(
          (row) => parseFloat(row[column.accessorKey]) || 0
        );
        values.sort((a, b) => a - b);
        let Sum = values.reduce((acc, value) => acc + value, 0);
        let Count = values.length;
        let Average = Count ? Sum / Count : 0;
        let Max = Math.max(...values);
        let Min = Math.min(...values);
        let Median = 0;
        if (Count) {
          let middle = Math.floor(Count / 2);
          if (Count % 2 === 0) {
            Median = (values[middle - 1] + values[middle]) / 2;
          } else {
            Median = values[middle];
          }
        }
        return {
          ...column,
          Footer: column.Footer
            ? column.Footer(data)
            : {
                Count,
                Sum,
                Average,
                Max,
                Min,
                Median,
              },
        };
      } else if (
        column?.accessorKey?.startsWith("status") ||
        column?.accessorKey?.startsWith("dropdown")
      ) {
        let values = [];
        values = data.map((row) => row[column.accessorKey] || null);

        let compressedValues = values.reduce((acc, item) => {
          console.log("item: ");
          if (item === null || Array.isArray(item)) return acc;
          const key = `${item.text}`;
          if (!acc[key]) {
            acc[key] = { ...item, count: 1 };
          } else {
            acc[key].count += 1;
          }
          return acc;
        }, {});
        return compressedValues;
      } else if (column?.accessorKey?.startsWith("people")) {
        let values = data.map((row) => row[column.accessorKey] || null);
        let uniqueUsers = [];
        values
          .flat()
          .filter((user) => user !== null)
          .forEach((user) => {
            if (
              !uniqueUsers.some(
                (existingUser) => existingUser.email === user.email
              )
            ) {
              uniqueUsers.push(user);
            }
          });
        return uniqueUsers;
      } else {
        return null;
      }
    };

    return totals();
  };

  console.log("Total: ", totalRow());
  const statusData = totalRow();

  const renderStatusBars = () => {
    if (!statusData || typeof statusData !== "object") return null;

    const totalCount = Object.values(statusData).reduce(
      (acc, item) => acc + item.count,
      0
    );
    return Object.values(statusData).map((item, index) => (
      <div
        key={index}
        className={`border ${item.color} h-8`}
        style={{
          backgroundColor: item.color,
          width: `${(item.count / totalCount) * 100}%`,
          display: "inline-block",
        }}
        title={`${item.text}: ${item.count}`}
      ></div>
    ));
  };
  return (
    <td className=' h-full '>
      {totalRow()?.accessorKey?.startsWith("number") ? (
        <div className='flex items-center' title={formulaState}>
          <Dropdown className=''>
            <DropdownTrigger>
              <button className='h-full  w-full text-center hover:bg-gray-400 flex items-center justify-center p-1 rounded-md'>
                {totalRow()?.Footer &&
                  totalRow()?.Footer[formulaState] &&
                  totalRow()?.Footer[formulaState]}
              </button>
            </DropdownTrigger>
            <DropdownMenu variant='faded' aria-label='Dropdown menu with icons'>
              <DropdownItem key='Sum' onClick={() => setFormulaState("Sum")}>
                Sum
              </DropdownItem>
              <DropdownItem
                key='Average'
                onClick={() => setFormulaState("Average")}
              >
                Average
              </DropdownItem>
              <DropdownItem
                key='Count'
                onClick={() => setFormulaState("Count")}
              >
                Count
              </DropdownItem>
              <DropdownItem key='Min' onClick={() => setFormulaState("Min")}>
                Min
              </DropdownItem>
              <DropdownItem key='Max' onClick={() => setFormulaState("Max")}>
                Max
              </DropdownItem>
              <DropdownItem
                key='Median'
                onClick={() => setFormulaState("Median")}
              >
                Median
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : column?.accessorKey?.startsWith("status") ||
        column?.accessorKey?.startsWith("dropdown") ? (
        <div style={{ width: "100%", display: "flex" }}>
          {renderStatusBars()}
        </div>
      ) : (
        column?.accessorKey?.startsWith("people") && (
          <div className='flex flex-wrap w-full items-center justify-center'>
            <div className='relative w-9 h-9'>
              {totalRow().map((user, index) => (
                <div
                  key={index}
                  className='absolute w-8 h-8 rounded-full'
                  title={user.name}
                  style={{ right: `${index * -20}px`, zIndex: index }}
                >
                  <img
                    className='rounded-full w-full h-full'
                    src={user.picture}
                    alt='user'
                  />
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </td>
  );
};

export default TableFooter;
