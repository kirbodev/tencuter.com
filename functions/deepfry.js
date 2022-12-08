const fetch = require("isomorphic-fetch");
const { createCanvas, loadImage } = require("canvas");

module.exports.handler = async (event, context, callback) => {
  try {
    // Deepfry the image
    const gif = event.path.split("/").pop();
    const gifurl = await fetch(`https://tenor.com/view/${gif}`);
    const resultText = await gifurl.text();
    const resultGif = resultText.match(/https:\/\/media.tenor.com\/[a-z0-9]+/i)[0];
    const result = await fetch(resultGif);
    const buffer = await result.buffer();
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");
    const img = await loadImage(buffer);
    ctx.drawImage(img, 0, 0, 1080, 1080);
    desaturate(ctx, 0, 0, 1080, 1080, 0.2);
    boostRed(ctx, 0, 0, 1080, 1080, 0.1);
    noise(ctx, 0, 0, 1080, 1080, 0.15);
    contrast(ctx, 0, 0, 1080, 1080, 0.2);
    sharpen(ctx, 0, 0, 1080, 1080);
    const data = canvas.toBuffer("image/jpeg", { quality: 0.1 });

    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: data.toString("base64"),
      isBase64Encoded: true,
    });
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: `Something went wrong: ${e}`,
    });
  }
};

function desaturate(ctx, x, y, width, height, amount) {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] += (avg - data[i]) * amount;
        data[i + 1] += (avg - data[i + 1]) * amount;
        data[i + 2] += (avg - data[i + 2]) * amount;
    }
    ctx.putImageData(imageData, x, y);
}

function boostRed(ctx, x, y, width, height, amount) {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] += (255 - data[i]) * amount;
    }
    ctx.putImageData(imageData, x, y);
}

function noise(ctx, x, y, width, height, amount) {
  const imageData = ctx.getImageData(x, y, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const rand = Math.random() * amount * 255;
    data[i] += rand;
    data[i + 1] += rand;
    data[i + 2] += rand;
  }
  ctx.putImageData(imageData, x, y);
}

function contrast(ctx, x, y, width, height, amount) {
  const imageData = ctx.getImageData(x, y, width, height);
  const data = imageData.data;
  const factor = (259 * (amount + 255)) / (255 * (259 - amount));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  ctx.putImageData(imageData, x, y);
}

function sharpen(ctx, x, y, width, height) {
  const imageData = ctx.getImageData(x, y, width, height);
  const data = imageData.data;
  const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const src = data;
  const sw = width;
  const sh = height;
  const w = sw;
  const h = sh;
  const output = ctx.createImageData(w, h);
  const dst = output.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sy = y;
      const sx = x;
      const dstOff = (y * w + x) * 4;
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
          const scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
          const srcOff = (scy * sw + scx) * 4;
          const wt = weights[cy * side + cx];
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
          a += src[srcOff + 3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + 255 * 0.2;
    }
  }
  ctx.putImageData(output, x, y);
}
