export const renameUploadedFile = (
  uploadedFile,
  headers,
  defaultStatus,
  defaultDropdown
) => {
  const keyMapping = headers?.reduce((acc, header) => {
    acc[header.text] = header.accessorKey;
    return acc;
  }, {});
  const findStatus = (text) => {
    let existingStatus = defaultStatus.find((status) => status.text === text);
    if (!existingStatus) {
      const highestId = Math.max(...defaultStatus.map((status) => status.id));
      if (text !== "" && text !== undefined && text !== null) {
        const newStatus = {
          id: highestId + 1,
          color: "bg-a-grey",
          text: text,
        };
        defaultStatus.push(newStatus);
        existingStatus = newStatus;
      }
    }
    return existingStatus;
  };
  const findDropdown = (text) => {
    let existingDropdown = defaultDropdown.find(
      (dropdown) => dropdown.text === text
    );
    if (!existingDropdown) {
      let highestId = 0;
      if (defaultDropdown.length > 0) {
        highestId = Math.max(...defaultDropdown.map((dropdown) => dropdown.id));
      } else {
        highestId = 0;
      }
      if (text !== "" && text !== undefined && text !== null) {
        const newDropdown = {
          id: highestId + 1,
          color: "bg-a-grey",
          text: text,
        };
        defaultDropdown.push(newDropdown);
        existingDropdown = newDropdown;
      } else {
        console.log("Trihher else");
      }
    }
    return existingDropdown;
  };

  return uploadedFile.map((item, index) => {
    const renamedItem = { id: index };
    Object.keys(item).forEach((key) => {
      const newKey = keyMapping[key] || key;
      if (newKey.startsWith("status")) {
        renamedItem[newKey] = findStatus(item[key]);
      } else if (newKey.startsWith("dropdown")) {
        renamedItem[newKey] = findDropdown(item[key]);
      } else if (newKey.startsWith("id")) {
        renamedItem[newKey] = index;
      } else {
        renamedItem[newKey] = item[key];
      }
    });
    return renamedItem;
  });
};
