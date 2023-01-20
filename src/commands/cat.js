const fetch = require("node-fetch");
const kvDB = require("../db/kvdb");
const crypto = require("crypto");
const express = require("express");

module.exports = {
  name: "cat",
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
      const cached = await kvDB.get(`cat-${hash}`);
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
      const result1 = await fetch("https://cataas.com/cat?json=true");
      const resultURL = await result1.json();
      const result = await fetch(`https://cataas.com${resultURL.url}`);
      const buffer = await result.buffer();

      kvDB.set(`cat-${hash}`, `https://cataas.com${resultURL.url}`);

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
      });
      res.end(buffer);
    } catch (e) {
      next("500");
    }
  },
};
