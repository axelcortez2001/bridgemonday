import React from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";
const Upload = ({ uploadedFile, setUploadedFile }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      delimiter: "",
      newline: "",
      quoteChar: '"',
      escapeChar: '"',
      header: true,
      transformHeader: undefined,
      dynamicTyping: false,
      preview: 0,
      encoding: "",
      worker: false,
      comments: false,
      step: undefined,

      complete: (results) => {
        const validate = results.data.some((row) =>
          Object.keys(row).some((key) => key.startsWith("_"))
        );
        if (validate) {
          toast.error("Invalid Table format");
        } else {
          setUploadedFile(results.data);
        }
      },
    });
  };
  return (
    <div className='flex items-center flex-col gap-3 p-2 justify-center w-full h-full'>
      <p className='text-2xl font-bold text-gray-500'>Upload File</p>
      <div className=' w-full rounded-md flex items-center justify-start'>
        {uploadedFile && uploadedFile.length > 0 ? (
          <div className='w-full flex flex-row items-center gap-4'>
            <p className='text-lg '>File Uploaded</p>
            <Button color='danger' onClick={() => setUploadedFile([])}>
              Remove
            </Button>
          </div>
        ) : (
          <input
            type='file'
            accept='.csv'
            className='outline-none hover:cursor-pointer'
            onChange={handleFileUpload}
          />
        )}
      </div>
      <div className='border rounded-md w-full h-[80%] flex flex-col p-3 gap-10'>
        <div className='flex flex-col w-full'>
          <p className='text-xl font-bold text-a-green'>VALID FORMAT</p>
          <p>Description here....</p>
          <table className='border'>
            <thead className='border'>
              <tr>
                <th className='border p-2'>Valid Item 1</th>
                <th className='border p-2'>Valid Item 2</th>
                <th className='border p-2'>Valid Item 3</th>
                <th className='border p-2'> Valid Item 4</th>
                <th className='border p-2'>Valid Item 5</th>
              </tr>
            </thead>
            <tbody>
              <tr className='text-center'>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
              </tr>
              <tr className='text-center'>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='flex flex-col w-full'>
          <p className='text-xl font-bold text-a-red'>INVALID FORMAT</p>
          <p>Description here....</p>
          <table className='border'>
            <thead className='border'>
              <tr>
                <th className='border p-2'>Sample Invalid Title</th>
              </tr>
              <tr>
                <th className='border p-2'>Another Invalid Title</th>
                <th className='border p-2'></th>
                <th className='border p-2'></th>
                <th className='border p-2'></th>
                <th className='border p-2'></th>
              </tr>
              <tr>
                <th className='border p-2'>Invalid Item 1</th>
                <th className='border p-2'>Invalid Item 2</th>
                <th className='border p-2'>Invalid Item 3</th>
                <th className='border p-2'> Invalid Item 4</th>
                <th className='border p-2'>Invalid Item 5</th>
              </tr>
            </thead>
            <tbody>
              <tr className='text-center'>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
                <td className='border'>Item 1</td>
              </tr>
              <tr className='text-center'>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
                <td className='border'>Item 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Upload;
