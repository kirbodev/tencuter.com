const fetch = require("node-fetch");
const cgif = require("canvas-gif");
const gifInfo = require("gif-info");
const getGif = require("../../tools/getGif");
const express = require("express");
const db = require("../db/db");

module.exports = {
  name: "fisheye",
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const gif = req.url.split("/").pop();
      if (await db.get(`fisheye-${gif}`)) {
        const gifdata = await db.get(`fisheye-${gif}`);
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

        cgif(buffer, fisheye, {
          optimiser: true,
          fps: fps,
          quality: 50,
        }).then((data) => {
          db.set(`fisheye-${gif}`, {
            name: `fisheye-${gif}`,
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

function fisheye(context, width, height, totalFrames, currentFrame) {
  const level = 50;
  const frame = context.getImageData(0, 0, width, height);
  const data = frame.data;
  const source = new Uint8Array(data);

  for (let i = 0; i < data.length; i += 4) {
    const sx = (i / 4) % frame.width;
    const sy = Math.floor(i / 4 / frame.width);

    const dx = Math.floor(frame.width / 2) - sx;
    const dy = Math.floor(frame.height / 2) - sy;

    const dist = Math.sqrt(dx * dx + dy * dy);

    const x2 = Math.round(
      frame.width / 2 - dx * Math.sin(dist / (level * Math.PI) / 2)
    );
    const y2 = Math.round(
      frame.height / 2 - dy * Math.sin(dist / (level * Math.PI) / 2)
    );
    const i2 = (y2 * frame.width + x2) * 4;

    data[i] = source[i2];
    data[i + 1] = source[i2 + 1];
    data[i + 2] = source[i2 + 2];
  }

  context.putImageData(frame, 0, 0);
}
