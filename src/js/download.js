/*global showSaveFilePicker*/

import JSZip from "jszip";

function exportBlob (content, fileName) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(content);
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  a.click();
  URL.revokeObjectURL(url);
}

export const downloadTypes = {
  zip: {
    types: [
      {
        description: "ZIP archive",
        accept: { "application/zip": [".zip"] },
      },
    ]
  },
  image: {
    types: [
      {
        description: "Image",
        accept: { "image/png": [".png"] },
      },
    ]
  }
};

export async function downloadBlob (blob, filename, type) {
  // only works in chrome
  if (window.showSaveFilePicker) {
    try {
      const handle = await showSaveFilePicker({
        suggestedName: filename,
        types: type.types || [],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      writable.close();
    } catch {
      // ...
    }
  } else {
    // force download
    exportBlob(blob, filename);
  }
}

export async function compressAsZip (files) {
  const zip = new JSZip();
  files.forEach(({ filename, data }) => {
    zip.file(filename, data);
  });

  const blob = await zip.generateAsync({ type:"blob" });
  return blob;
}
