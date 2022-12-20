const fetch = require("isomorphic-fetch");
const cgif = require("canvas-gif");
const gifInfo = require("gif-info");

module.exports.handler = async (event, context, callback) => {
  try {
  // Deepfry the image
  const gif = event.path.split("/").pop();
  const gifurl = await fetch(`https://tenor.com/view/${gif}`);
  const resultText = await gifurl.text();
  const resultGif = resultText.match(
    /https:\/\/media.tenor.com\/[a-z0-9]+/i
  )[0];
  const result = await fetch(resultGif);
  const buffer = await result.buffer();
  const arrayBuffer = new Uint8Array(buffer).buffer;
  const info = gifInfo(arrayBuffer);
  const fps = info.images.length / (info.duration / 1000);

  cgif(buffer, deepfry, {
    optimiser: true,
    fps: fps,
    quality: 50,
  }).then((data) => {
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "image/gif",
      },
      body: data.toString("base64"),
      isBase64Encoded: true,
    });
  });
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: `Something went wrong: ${e}`,
    });
  }
};

function deepfry(context, width, height, totalFrames, currentFrame) {
  saturate(context, 0, 0, width, height);
  contrast(context, 0, 0, width, height);
  posterise(context, 0, 0, width, height);
}

function saturate(context, x, y, width, height, amount = -15) {
  const imageData = context.getImageData(x, y, width, height);
  const data = imageData.data;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const dest = (i * width + j) * 4;
      const grey = Number.parseInt(
        0.2125 * data[dest] + 0.7154 * data[dest + 1] + 0.0721 * data[dest + 2]
      );
      data[dest] += amount * (grey - data[dest]);
      data[dest + 1] += amount * (grey - data[dest + 1]);
      data[dest + 2] += amount * (grey - data[dest + 2]);
    }
  }

  context.putImageData(imageData, x, y);
}

function contrast(context, x, y, width, height, amount = 10) {
  const imageData = context.getImageData(x, y, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] += (amount * (data[i] - 128)) / 100;
    data[i + 1] += (amount * (data[i + 1] - 128)) / 100;
    data[i + 2] += (amount * (data[i + 2] - 128)) / 100;
  }

  context.putImageData(imageData, x, y);
}

function posterise(context, x, y, width, height, amount = 30) {
  const imageData = context.getImageData(x, y, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.floor(data[i] / amount) * amount;
    data[i + 1] = Math.floor(data[i + 1] / amount) * amount;
    data[i + 2] = Math.floor(data[i + 2] / amount) * amount;
  }

  context.putImageData(imageData, x, y);
}
