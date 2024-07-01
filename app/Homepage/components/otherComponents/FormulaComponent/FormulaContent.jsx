import React from "react";
import { getAllItems } from "../../functions/FormulaFunction/mainFunction";

const FormulaContent = ({
  columnData,
  chosenFunction,
  chosenColumn,
  selectedProject,
  extension,
}) => {
  const allItems = getAllItems(selectedProject, chosenColumn, extension);
  console.log("All Item: ", allItems);
  return (
    <div>
      {chosenFunction !== "None" ? (
        <div>
          <p>Function: </p> <span>{chosenFunction}</span>
          {"    "}
          <span>{chosenColumn !== null && chosenColumn.newItemName}</span>
          <span>{extension}</span>
        </div>
      ) : (
        <p>Select a function</p>
      )}
      {chosenColumn !== null && (
        <table className='w-full border max-h-full overflow-y-auto'>
          <thead>
            <tr>
              <th className='border '>{chosenColumn.newItemName}</th>
              <th className='border '>Value</th>
            </tr>
          </thead>
          <tbody>
            {allItems.length > 0 &&
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
      )}
    </div>
  );
};

export default FormulaContent;
