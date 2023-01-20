const fetch = require("node-fetch");
const cgif = require("canvas-gif");
const gifInfo = require("gif-info");
const stackblur = require("stackblur-canvas");
const getGif = require("../../tools/getGif");
const express = require("express");
const db = require("../db/db");

module.exports = {
  name: "blur",
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const gif = req.url.split("/").pop();
      if (await db.get(`blur-${gif}`)) {
        const buffer = await db.get(`blur-${gif}`);
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

        cgif(buffer, blur, {
          optimiser: true,
          fps: fps,
          quality: 50,
        }).then((data) => {
          db.set(`blur-${gif}`, {
            name: `blur-${gif}`,
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

function blur(context, width, height, totalFrames, currentFrame) {
  const imageData = context.getImageData(0, 0, width, height);
  stackblur.imageDataRGBA(imageData, 0, 0, width, height, 10);
  context.putImageData(imageData, 0, 0);
}
