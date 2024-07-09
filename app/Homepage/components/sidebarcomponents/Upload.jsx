import React from "react";
import Papa from "papaparse";
const Upload = ({ uploadedFile, setUploadedFile }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setUploadedFile(results.data);
      },
    });
  };
  return (
    <div className='flex items-center flex-col gap-3 p-2 justify-center w-full h-full'>
      <p>Upload File</p>
      <div className='border w-full h-[70%] rounded-md flex items-center justify-center'>
        {uploadedFile && uploadedFile.length > 0 ? (
          <div>
            <p>File Uploaded</p>
            <button onClick={() => setUploadedFile([])}>Remove</button>
          </div>
        ) : (
          <input type='file' accept='.csv' onChange={handleFileUpload} />
        )}
      </div>
    </div>
  );
};

export default Upload;
