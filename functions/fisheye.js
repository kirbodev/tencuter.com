const fetch = require("isomorphic-fetch");
const cgif = require("canvas-gif");
const gifInfo = require("gif-info");

module.exports.handler = async (event, context, callback) => {
  try {
    // Deepfry the image
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
    const buffer = await result.buffer();
    const arrayBuffer = new Uint8Array(buffer).buffer;
    const info = gifInfo(arrayBuffer);
    const fps = info.images.length / (info.duration / 1000);

    cgif(buffer, fisheye, {
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

function fisheye(context, width, height, totalFrames, currentFrame) {
    const level = 50;
    const frame = context.getImageData(0, 0, width, height);
    const data = frame.data;
    const source = new Uint8Array(data)

    for (let i = 0; i < data.length; i += 4) {
        const sx = (i / 4) % frame.width;
        const sy = Math.floor((i / 4) / frame.width);

        const dx = Math.floor(frame.width / 2) - sx;
        const dy = Math.floor(frame.height / 2) - sy;

        const dist = Math.sqrt(dx * dx + dy * dy);

        const x2 = Math.round((frame.width / 2) - (dx * Math.sin(dist / (level * Math.PI) / 2)));
        const y2 = Math.round((frame.height / 2) - (dy * Math.sin(dist / (level * Math.PI) / 2)));
        const i2 = (y2 * frame.width + x2) * 4;

        data[i] = source[i2];
        data[i + 1] = source[i2 + 1];
        data[i + 2] = source[i2 + 2];
    };

    context.putImageData(frame, 0, 0);
};