const fetch = require("node-fetch");
const express = require("express");

module.exports = {
  name: "pe",
  imgOnly: true,
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const result = await fetch("https://i.ibb.co/5RM3S6T/pe-1.png");
      const buffer = await result.buffer();

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
