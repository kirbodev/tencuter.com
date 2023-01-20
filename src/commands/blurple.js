const cgif = require("canvas-gif");
const gifInfo = require("gif-info");
const fetch = require("node-fetch");
const getGif = require("../../tools/getGif");
const express = require("express");
const db = require("../db/db");
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

module.exports = {
  name: "blurple",
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const gif = req.url.split("/").pop();
      if (await db.get(`blurple-${gif}`)) {
        const gifdata = await db.get(`blurple-${gif}`);
        const buffer = Buffer.from(gifdata, "base64");
        res.writeHead(200, {
          "Content-Type": "image/gif",
          "Content-Length": buffer.length,
        });
        res.end(buffer);
      } else {
        const buffer = await getGif(`https://tenor.com/view/${gif}`);
        if (!buffer) {
          next("404");
          return;
        }
        const arrayBuffer = new Uint8Array(buffer).buffer;
        const info = gifInfo(arrayBuffer);
        const fps = info.images.length / (info.duration / 1000);

        cgif(
          buffer,
          (context, width, height, totalFrames, currentFrame) => {
            const imageData = context.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];
              if (a === 0) continue;
              const intensity = r + g + b;
              if (intensity > 765) intensity = 765;
              if (intensity < 0) intensity = 0;
              let color = colors[Math.floor((intensity / 765) * colors.length)];
              data[i] = color[0];
              data[i + 1] = color[1];
              data[i + 2] = color[2];
            }
            context.putImageData(imageData, 0, 0);
          },
          {
            optimiser: true,
            fps: fps,
            quality: 50,
          }
        ).then((data) => {
          db.set(`blurple-${gif}`, {
            name: `blurple-${gif}`,
            data: data,
          });

          res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": data.length,
          });
          res.end(data);
        });
      }
    } catch (e) {
      next("500");
    }
  },
};
