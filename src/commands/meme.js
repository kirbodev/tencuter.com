const randomMeme = require("../../tools/randomMeme.js");
const fetch = require("node-fetch");
const kvDB = require("../db/kvdb");
const crypto = require("crypto");
const express = require("express");

module.exports = {
  name: "meme",
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const hash = crypto
        .createHash("sha256")
        .update(req.url)
        .digest("hex")
        .slice(0, 6);
      const cached = await kvDB.get(`meme-${hash}`);
      if (cached) {
        const result = await fetch(cached);
        const buffer = await result.buffer();
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": buffer.length,
        });
        res.end(buffer);
        return;
      }
      const meme = await randomMeme();
      const image = Buffer.from(meme.buffer, "base64");

      kvDB.set(`meme-${hash}`, meme.url);

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": image.length,
      });
      res.end(image);
    } catch (e) {
      next("500");
      console.error(e);
    }
  },
};
