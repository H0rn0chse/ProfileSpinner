function canvasToBlob (canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

let sharedCanvas;
function getCanvas (createNew) {
  let canvas;
  if (createNew) {
    canvas = document.createElement("canvas");
  } else {
    if (!sharedCanvas) {
      canvas = document.createElement("canvas");
    } else {
      canvas = sharedCanvas;
    }
  }

  // debug settings
  canvas.style.position = "fixed";
  canvas.style.right = 0;
  canvas.style.bottom = 0;
  canvas.style.borderColor = "red";
  canvas.style.borderWidth = "1px";
  canvas.style.borderStyle = "solid";
  // document.body.appendChild(canvas);

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

export async function composeImage (imageUrl, width, height, degree) {
  const canvas = getCanvas(true);
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  ctx.translate(width / 2, height / 2);
  ctx.rotate(degree * Math.PI / 180);
  ctx.translate(-width / 2, -height / 2);

  await drawImageUrl(ctx, imageUrl, { x: 0, y: 0 });

  const blob = await canvasToBlob(canvas);

  return blob;
}

