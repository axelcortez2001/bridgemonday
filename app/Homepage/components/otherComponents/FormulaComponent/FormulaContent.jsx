import React from "react";
import { getAllItems } from "../../functions/FormulaFunction/mainFunction";

const FormulaContent = ({
  columnData,
  columnArray,
  chosenFunction,
  chosenColumn,
  selectedProject,
  extension,
}) => {
  const allItems = getAllItems(
    chosenFunction,
    selectedProject,
    chosenColumn,
    extension
  );
  return (
    <div>
      {chosenFunction !== "None" ? (
        <div className='w-full flex-col border-b-2'>
          <p>Function: </p>
          <div className='flex flex-wrap'>
            <span className='text-a-blue font-bold'>{chosenFunction}</span>
            {"    "}
            {chosenFunction === "IF" ? (
              <>
                {"( "}
                <span className='font-bold text-a-blue '>value</span>
                <span className='text-a-blue font-bold'>
                  {`  ${extension}`}
                </span>
                {" )"}
              </>
            ) : (
              columnArray &&
              columnArray.length > 0 && (
                <div className='flex flex-row '>
                  {"("}
                  {columnArray.map((col) => (
                    <div key={col.newItemName}>
                      <span className=' font-bold'>
                        {" {"}
                        {col.newItemName}
                        {"} "}
                      </span>
                    </div>
                  ))}
                  {")"}
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <p>Select a function</p>
      )}

      <div className='flex flex-row w-full mt-2 gap-2'>
        {chosenFunction && chosenFunction === "IF" && (
          <div className='border w-3/4 flex flex-col p-2 rounded-md text-gray-700 text-sm gap-y-2'>
            <p className='font-bold'>Sample Formula:</p>
            <div className='flex flex-col'>
              <p className='font-bold text-[16px]'>If Statement:</p>
              <p className='flex flex-wrap'>
                <span className='font-bold text-a-blue mr-1'>IF</span>
                {"("}
                <span className='font-bold mr-1 text-a-blue'>value</span>
                <span className='mr-1 text-a-blue'>{" >= "}</span>
                <span className='font-bold mr-1'>250</span>
                <span className=' text-a-blue mr-1'>{" && "}</span>
                <span className='font-bold mr-1'>{`"High Number"`}</span>
                {")"}
              </p>

              <p className='flex flex-wrap'>
                <span className='font-bold mr-1'>Result:</span>{" "}
                <span className=' mr-1'>500</span>
                <span className=' font-bold mr-1 text-a-blue'>{`= "High
                Number,`}</span>
                <span className=' mr-1'>100</span>
                <span className='font-bold mr-1 text-a-blue'>{`= No Result`}</span>
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold text-[16px]'>Else If Statement:</p>
              <p>{`IF (value >= 250 ? "High Number" : "Low Number")`}</p>
              <div>{`Result: 100 = "Low Number", 500 = "High Number"`}</div>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold'>IF Statement with OR:</p>
              <p>{`IF (value == 250 || value == 500 ? "High Number" : "Low Number")`}</p>
              <div>{`Result: 250 = "High Number", 500 = "High Number"`}</div>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold'>IF Statement with AND:</p>
              <p>{`IF (value > 250 && value < 500 ? "Value Valid" : "Value Invalid")`}</p>
              <div>{`Result: 300 = "Value Valid", 500 = "Value Invalid"`}</div>
            </div>
          </div>
        )}
        {chosenFunction && chosenFunction === "IF" && chosenColumn !== null && (
          <div className='w-1/2'>
            <table className='w-full border max-h-full overflow-y-auto'>
              <thead>
                <tr>
                  <th className='border '>{chosenColumn.newItemName}</th>
                  <th className='border '>Value</th>
                </tr>
              </thead>
              <tbody>
                {allItems &&
                  allItems.length > 0 &&
                  allItems.map(
                    (item, index) =>
                      item !== null && (
                        <tr key={index}>
                          <td className='border'>{item?.keyData}</td>
                          <td className='border'>{item?.value}</td>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {chosenFunction &&
        chosenFunction !== "IF" &&
        columnArray &&
        columnArray.length > 0 && (
          <></>
          // <table>
          //   <thead>
          //     <tr>
          //       {columnArray.map((col, index) => (
          //         <th className='border p-2' key={index}>
          //           {col.newItemName}
          //         </th>
          //       ))}
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {allItems &&
          //       allItems.map((item, index) => (
          //         //
          //         <td key={index} className='border p-2'>
          //           {item?.keyData?.map((col, index) => (
          //             <tr className='border bg-orange-300\' key={index}>
          //               <td className='border'>{col}</td>
          //             </tr>
          //           ))}
          //         </td>
          //       ))}
          //   </tbody>
          // </table>
        )}
    </div>
  );
};

export default FormulaContent;
