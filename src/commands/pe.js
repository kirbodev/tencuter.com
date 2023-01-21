const fs = require("fs");
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
      const mainBuffer = await fs.promises.readFile("./src/assets/img/pe.png");

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
