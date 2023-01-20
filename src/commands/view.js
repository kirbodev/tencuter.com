const fetch = require("node-fetch");
const express = require("express");

module.exports = {
  name: "view",
  imgOnly: true,
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const main = await fetch("https://i.ibb.co/mDKjFYh/So-Cute-Main-1.png");
      const mainBuffer = await main.buffer();

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": mainBuffer.length,
      });
      res.end(mainBuffer);
    } catch (e) {
      next("500");
    }
  },
};
