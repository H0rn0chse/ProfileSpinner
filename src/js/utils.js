import { default as textFit } from "textfit";

/*global showSaveFilePicker*/

export function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function translateSize (target, source, ref) {
  const ratio = {
    x: target.w / ref.w,
    y: target.h / ref.h
  };

  return {
    x: source.x * ratio.y,
    y: source.y * ratio.y,
    w: source.w * ratio.x,
    h: source.h * ratio.y
  };
}

export function fitText ({ text, width, height, font }) {
  const elem = document.createElement("div");
  elem.innerText = text;
  elem.style.width = `${width}px`;
  elem.style.height = `${height}px`;
  if (font) {
    elem.style.fontFamily = font;
  }

  // styling
  elem.style.position = "fixed";
  elem.style.top = `${-height}px`;
  elem.style.lineHeight = "normal";

  // debug
  const debug = false;
  if (debug) {
    elem.style.top = 0;
    elem.style.left = 0;
    elem.style.backgroundColor = "blue";
  }

  document.body.appendChild(elem);

  try {
    textFit(elem, {
      detectMultiLine: false,
      minFontSize: 0,
      maxFontSize: 50000,
      reProcess: true
    });
  } catch (err) {
    // console.error(err);
  }

  const target = elem.querySelector(".textFitted");
  const fontSize = target?.style?.fontSize;

  // cleanup
  if (!debug) {
    elem.remove();
  }

  return ({
    fontSize
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
    //document.body.appendChild(canvas);
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

async function drawText (ctx, options) {
  const textBox = translateSize(options.image, options.textBox, options.textBox.ref);
  const { fontSize } = fitText({
    text: options.text,
    width: textBox.w,
    height: textBox.h,
    font: options.font
  });

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${textBox.w}" height="${textBox.h}">
      <style>
        div {
          font-family: "${options.font}";
          color: ${options.fontColor || "rgb(255, 255, 255)"};
          font-size: ${fontSize};
          display: flex;
          white-space: nowrap;
          line-height: normal;
          justify-content: center;
          align-items: center;
        }
      </style>
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${options.text}</div>
      </foreignObject>
    </svg>`;

  const url = `data:image/svg+xml; charset=utf8, ${encodeURIComponent(svg)}`;
  // browser taints the canvas when using blobUrl instead of dataUrl
  // const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  // const svgObjectUrl = URL.createObjectURL(svgBlob);

  await drawImageUrl(ctx, url, textBox);
  // URL.revokeObjectURL(svgObjectUrl);
}

export async function exportImage (options) {
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");

  canvas.width = options.image.w;
  canvas.height = options.image.h;
  // ctx.fillStyle = "white"
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  await drawImageUrl(ctx, options.image.src, { x: 0, y: 0 });

  await drawText(ctx, options);

  const blob = await canvasToBlob(canvas);



  // only works in chrome
  if (window.showSaveFilePicker) {
    try {
      const handle = await showSaveFilePicker({
        suggestedName: "avatar.png",
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
  }

  // force download
  //exportBlob(blob, "avatar.png");

  return URL.createObjectURL(blob);
}

function canvasToBlob (canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

function exportBlob (content, fileName) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(content);
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  a.click();
  URL.revokeObjectURL(url);
}
