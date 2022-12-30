const cgif = require("canvas-gif");
const gifInfo = require("gif-info");
const fetch = require("isomorphic-fetch");
let colors = [
  [69, 79, 191],
  [71, 81, 197],
  [73, 84, 202],
  [75, 86, 208],
  [77, 89, 213],
  [79, 91, 219],
  [82, 94, 225],
  [84, 96, 230],
  [86, 99, 236],
  [88, 101, 242],
  [114, 117, 244],
  [137, 133, 246],
  [156, 150, 248],
  [175, 166, 249],
  [192, 184, 251],
  [208, 201, 252],
  [224, 219, 253],
  [240, 237, 254],
  [255, 255, 255],
];

module.exports.handler = async (event, context, callback) => {
  try {
    let buffer;
    if (event.headers.host.split(".")[0] === "media") {
      // Change media.tencuter.com to media.discordapp.net
      const media = event.path.replace("/.netlify/functions/blurple", "/attachments");
      const mediaurl = await fetch(`https://media.discordapp.net${media}`);
      const result = await mediaurl.buffer();
      if (mediaurl.status === 401 || mediaurl.status === 404 || !result) {
        const notFound = await fetch("https://tencuter.com/assets/img/404.png");
        const buffer = await notFound.buffer();
        callback(null, {
          statusCode: 404,
          headers: {
            "Content-Type": "image/png",
          },
          body: buffer.toString("base64"),
          isBase64Encoded: true,
        });
        return;
      } else {
        buffer = result;
      }
    } else {
      const gif = event.path.split("/").pop();
      const gifurl = await fetch(`https://tenor.com/view/${gif}`);
      const resultText = await gifurl.text();
      const resultGifList = resultText.match(
        /https:\/\/media.tenor.com\/[a-z0-9]+/i
      );
      if (!resultGifList) {
        const notFound = await fetch("https://tencuter.com/assets/img/404.png");
        const buffer = await notFound.buffer();
        callback(null, {
          statusCode: 404,
          headers: {
            "Content-Type": "image/png",
          },
          body: buffer.toString("base64"),
          isBase64Encoded: true,
        });
      }
      const resultGif = resultGifList[0];
      const result = await fetch(resultGif);
      buffer = await result.buffer();
    }
    const arrayBuffer = new Uint8Array(buffer).buffer;
    const info = gifInfo(arrayBuffer);
    const fps = info.images.length / (info.duration / 1000);

    cgif(
      buffer,
      (context, width, height, totalFrames, currentFrame) => {
        // Get the image data
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        // Loop through each pixel
        for (let i = 0; i < data.length; i += 4) {
          // Get the RGB values
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const intensity = r + g + b;
          // Get the color
          let color = colors[Math.floor((intensity / 765) * colors.length)];
          // Set the pixel to the color
          data[i] = color[0];
          data[i + 1] = color[1];
          data[i + 2] = color[2];
        }
        // Put the image data back
        context.putImageData(imageData, 0, 0);
      },
      {
        optimiser: true,
        fps: fps,
        quality: 50,
      }
    ).then((gif) => {
      callback(null, {
        statusCode: 200,
        headers: {
          "Content-Type": "image/gif",
        },
        body: gif.toString("base64"),
        isBase64Encoded: true,
      });
    });
  } catch (e) {
    console.log(e);
    const imageAsHTML = require("../tools/HTMLImage");
    callback(null, {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
      },
      body: imageAsHTML("https://tencuter.com/assets/img/500.png"),
    });
  }
};