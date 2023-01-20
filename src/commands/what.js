const fetch = require("node-fetch");
const express = require("express");

module.exports = {
  name: "what",
  imgOnly: true,
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const image = await fetch("https://i.ibb.co/nQG4pq3/So-Cute-What.png");
      const imageData = await image.buffer();
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageData.length,
      });
      res.end(imageData);
    } catch (e) {
      next("500");
    }
  },
};
