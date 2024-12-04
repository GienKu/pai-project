import { logout } from "./logout.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await listFiles();
    uploadFile();
    createFolder();
    logout();
  } catch (e) {
    console.error(e);
  }
});

//! Create folder
const createFolder = () => {
  //* Get create folder button
  const createFolderBtn = document.querySelector(".create-folder");
  if (!createFolderBtn) return;
  //* Add event listener to create folder button
  createFolderBtn.addEventListener("click", async () => {
    const folderName = prompt("Podaj nazwę folderu");
    if (!folderName) return;
    const res = await fetch("api/cloud/directory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName }),
    });
    if (res.status === 200) {
      //* Refresh files list
      alert("Folder został utworzony");
      await listFiles();
    } else {
      //* Error creating folder
      alert("Nie udało się utworzyć folderu");
    }
  });
};

//! Valid error message for add file
const validError = (file, label, dropOver) => {
  //* Check if file exists
  if (!file) file = document.getElementById("file");
  if (!label) label = document.querySelector(".labelFile");
  if (!dropOver) dropOver = document.querySelector(".info-upload");
  if (!file || !label || !dropOver) return;
  //* Remove file
  file.value = null;
  label.innerHTML = "drag and drop your file here or click to select a file!";
  //* Remove over class
  dropOver.classList.remove("over");
  return;
};

//! Function to handle file selection
const handleFile = (fileInput, label, dropOver) => {
  const files = fileInput.files;
  if (files.length <= 0) return Promise.resolve();
  //* Set size of file
  const validFiles = [];
  //* Check if file is too large
  for (const file of files) {
    const fileSize = file.size / 1024 / 1024; //? in MB
    //? maxUploadSize - from server
    fileSize > maxUploadSize
      ? alert(`${file.name} is too large and will not be uploaded.`)
      : validFiles.push(file);
  }
  //* Check if there are any valid files
  if (validFiles.length <= 0) return validError(fileInput, label, dropOver);
  //* Update label with file names
  label.innerHTML = Array.from(validFiles)
    .map((file) => file.name)
    .join(", ");
  uploadFilesToServer(validFiles);
  return Promise.resolve();
};

//! Upload File client
const uploadFile = () => {
  //* Check if drop over area exists
  const dropOver = document.querySelector(".info-upload");
  const fileInput = document.getElementById("file");
  if (!fileInput || !dropOver) return;
  //* Add drop over events
  dropOver.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropOver.classList.add("over");
  });
  //* Remove over class
  ["dragleave", "dragend"].forEach((type) => {
    dropOver.addEventListener(type, (e) => {
      e.preventDefault();
      dropOver.classList.remove("over");
    });
  });
  //* Add drop event
  dropOver.addEventListener("drop", (e) => {
    e.preventDefault();
    //* Check if file exists
    if (!e.dataTransfer.files.length) return;
    //* Get file and set it to input
    const label = document.querySelector(".labelFile");
    fileInput.files = e.dataTransfer.files;
    //* Handle the file (validate and update label)
    handleFile(fileInput, label, dropOver);
    //* Remove over class
    dropOver.classList.remove("over");
  });
  //* Handle file selection via click
  fileInput.addEventListener("change", () => {
    const label = document.querySelector(".labelFile");
    handleFile(fileInput, label, dropOver);
  });
};

//! Upload files to server
const uploadFilesToServer = async (files) => {
  try {
    //* Create form data
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    if (files.length === 0) return alert("Brak plików do przesłania");
    //* Send files to server
    const res = await fetch("api/cloud/upload", {
      method: "POST",
      body: formData,
    });
    //* Check if files were uploaded
    if (res.status === 200) {
      alert("Udało się przesłać pliki");
      await listFiles();
      return Promise.resolve();
    }
    alert("Nie udało się przesłać plików");
    return validError();
  } catch (error) {
    console.error("Error uploading files", error);
    alert("Nie udało się przesłać plików");
    return validError();
  }
};

//! Add file to list
const addFileToList = (file) => {
  //* Check if list exists
  const list = document.querySelector(".files-list");
  if (!list) return;
  //* Create list item
  const listItem = document.createElement("li");
  listItem.classList.add("files-list-item");
  const fileContent = document.createElement("ul");
  const convertedPath = file.path.replace(/\\/g, "/") || "";
  if (file.type === "folder") {
    //* Create file name for directory
    listItem.classList.add("dir");
    listItem.dataset.path = convertedPath;
    fileContent.innerHTML = `<li>${file.name}</li>`;
    listItem.appendChild(fileContent);
  } else {
    //* Create file name for file
    const fileName = document.createElement("li");
    fileName.innerHTML = `${file.name}`;
    //* Create file size and date
    const fileSize = document.createElement("li");
    fileSize.innerHTML = `${file.size}MB`;
    const fileDate = document.createElement("li");
    fileDate.innerHTML = file.date;
    //* Create file buttons
    const fileButtons = document.createElement("li");
    const buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
    buttonDelete.dataset.id = file.id;
    buttonDelete.classList.add("delete-btn");
    const buttonDownload = document.createElement("button");
    buttonDownload.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>`;
    buttonDownload.dataset.id = file.id;
    buttonDownload.classList.add("download-btn");
    const buttonShare = document.createElement("button");
    buttonShare.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>`;
    buttonShare.dataset.id = file.id;
    buttonShare.dataset.path = convertedPath;
    buttonShare.classList.add("share-btn");
    // * Append elements to file content
    fileButtons.appendChild(buttonDelete);
    fileButtons.appendChild(buttonDownload);
    fileButtons.appendChild(buttonShare);
    fileContent.appendChild(fileName);
    fileContent.appendChild(fileSize);
    fileContent.appendChild(fileDate);
    fileContent.appendChild(fileButtons);
    listItem.appendChild(fileContent);
  }

  list.appendChild(listItem);
  return Promise.resolve();
};

//! List files from server
const listFiles = async () => {
  const res = await fetch("api/cloud/files/root");
  if (res.status === 200) {
    //* Check if list exists
    const list = document.querySelector(".files-list");
    if (!list) return;
    //* Clear list
    list.innerHTML = "";
    //* Get files
    const files = await res.json();
    //* Add files to list
    files.forEach((file) => addFileToList(file));
    //* Add event listeners to buttons
    deleteFile();
    downloadFile();
    shareFile();
  }
};

//! Delete file
const deleteFile = () => {
  //* Get all delete buttons
  const deleteBtn = document.querySelectorAll(".files-list-item .delete-btn");
  if (!deleteBtn || deleteBtn.length <= 0) return;
  deleteBtn.forEach((btn) => {
    //* Clone button
    const newButton = btn.cloneNode(true);
    btn.replaceWith(newButton);
    newButton.addEventListener("click", async (e) => {
      //* Get file id and delete file
      const fileId = e.target.closest(".delete-btn").dataset.id;
      //* Confirm delete
      const confirmed = confirm("Chcesz usunąć plik?");
      if (!confirmed) return;
      const res = await fetch(`api/cloud/delete/${fileId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      //* Check if file was deleted
      if (res.status === 200) {
        alert("Plik został usunięty");
        const fileItem = e.target.closest(".files-list-item");
        fileItem.remove();
      }
    });
  });
};

//! Download file
const downloadFile = () => {
  //* Get all download buttons
  const downloadBtn = document.querySelectorAll(".files-list-item .download-btn");
  if (!downloadBtn || downloadBtn.length <= 0) return;
  downloadBtn.forEach((btn) => {
    //* Clone button
    const newButton = btn.cloneNode(true);
    btn.replaceWith(newButton);
    newButton.addEventListener("click", async (e) => {
      //* Get file id and download file
      const fileId = e.target.closest(".download-btn").dataset.id;
      const res = await fetch(`api/cloud/download/${fileId}`);
      //* Check if file was downloaded
      if (res.status === 200) {
        try {
          //* Get file name from response
          const contentDisposition = res.headers.get("Content-Disposition");
          let fileName = "";
          if (contentDisposition && contentDisposition.includes("filename="))
            fileName = contentDisposition.split("filename=")[1].replace(/"/g, "");
          if (!fileName) return alert("Nie udało się pobrać nazwy pliku");
          //* Get blob from response
          const blob = await fetch(res.url).then((response) => response.blob());
          //* Create URL and download file
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          //* Revoke URL
          a.remove();
          window.URL.revokeObjectURL(url);
          alert("Plik został pobrany");
        } catch (error) {
          console.error("Wystąpił błąd podczas pobierania pliku:", error);
          alert("Nie udało się pobrać pliku. Spróbuj ponownie.");
        }
      }
    });
  });
};

//! Share file
const shareFile = () => {
  //* Get all share buttons
  const shareBtn = document.querySelectorAll(".files-list-item .share-btn");
  if (!shareBtn || shareBtn.length <= 0) return;
  shareBtn.forEach((btn) => {
    //* Clone button
    const newButton = btn.cloneNode(true);
    btn.replaceWith(newButton);
    newButton.addEventListener("click", async (e) => {
      //* Get file id and share file
      const fileId = e.target.closest(".share-btn").dataset.id;
      const path = e.target.closest(".share-btn").dataset.path;
      const res = await fetch(`api/cloud/share/${fileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      //* Check if file was shared
      if (res.status === 200) {
        const uri = res.json().shareUri;
        //* Copy to clipboard
        navigator.clipboard.writeText(uri);
        alert("Link do pliku został skopiowany do schowka");
        return;
      }
      alert("Nie udało się udostępnić pliku");
    });
  });
};
