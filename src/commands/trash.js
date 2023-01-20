const jimp = require("jimp");
const fetch = require("node-fetch");
const getGif = require("../../tools/getGif");
const express = require("express");
const db = require("../db/db");

module.exports = {
  name: "trash",
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const gif = req.url.split("/").pop();
      if (await db.get(`trash-${gif}`)) {
        const gifdata = await db.get(`trash-${gif}`);
        const buffer = Buffer.from(gifdata, "base64");
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": buffer.length,
        });
        res.end(buffer);
      } else {
        const buffer = await getGif(`https://tenor.com/view/${gif}`);
        if (!buffer) {
          next("404");
          return;
        }

        const trashimg = await fetch(
          "https://tencuter.com/assets/img/trash.png"
        );
        const trashbuffer = await trashimg.buffer();

        const frame = await jimp.read(buffer);
        const trash = await jimp.read(trashbuffer);

        frame.resize(195, 195);
        trash.composite(frame, 135, 135);

        const data = await trash.getBufferAsync(jimp.MIME_GIF);

        db.set(`trash-${gif}`, {
          name: `trash-${gif}`,
          data: data,
        });

        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Accept-Ranges": "bytes",
          "X-Content-Type-Options": "nosniff",
          "Content-Type": "image/png",
          "Content-Length": data.length,
        });
        res.end(data);
      }
    } catch (e) {
      next("500");
    }
  },
};
