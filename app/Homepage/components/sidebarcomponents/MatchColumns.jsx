import React from "react";

const MatchColumns = ({ uploadedFile }) => {
  console.log("UploadedFile: ", uploadedFile);
  const extractHeaders = (arr) => {
    let headers = new Set();
    arr.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        headers.add(key);
      });
    });

    return Array.from(headers);
  };

  // Extract headers dynamically
  const headers = extractHeaders(uploadedFile);

  return (
    <div>
      {headers && headers.length > 0 && (
        <div>
          {headers.map((header, index) => (
            <div key={index}>{header}</div>
          ))}
        </div>
      )}
    
    </div>
  );
};

export default MatchColumns;
