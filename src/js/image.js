/*global showSaveFilePicker*/

function exportBlob (content, fileName) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(content);
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  a.click();
  URL.revokeObjectURL(url);
}

function canvasToBlob (canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

let canvas;
function getCanvas () {
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.right = 0;
    canvas.style.bottom = 0;
    canvas.style.borderColor = "red";
    canvas.style.borderWidth = "1px";
    canvas.style.borderStyle = "solid";
    // document.body.appendChild(canvas);
  }
  // clear canvas
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function drawImageUrl (ctx, imageUrl, { x, y }) {
  return new Promise((resolve) => {
    const tempImg = new Image();
    tempImg.addEventListener("load", function () {
      ctx.drawImage(tempImg, x, y);
      tempImg.remove();
      resolve();
    }, { once: true });
    tempImg.src = imageUrl;
  });
}

export async function exportImage (imageUrl, width, height, angle) {
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  ctx.translate(width / 2, height / 2);
  ctx.rotate(angle * Math.PI / 180);
  ctx.translate(-width / 2, -height / 2);

  await drawImageUrl(ctx, imageUrl, { x: 0, y: 0 });

  const blob = await canvasToBlob(canvas);

  // only works in chrome
  if (window.showSaveFilePicker) {
    try {
      const handle = await showSaveFilePicker({
        suggestedName: "image.png",
        types: [
          {
            description: "Image",
            accept: { "image/png": [".png"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      writable.close();
    } catch {
      // ...
    }
  } else {
    // force download
    exportBlob(blob, "image.png");
  }

}

