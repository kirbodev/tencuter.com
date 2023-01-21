const express = require("express");
const fs = require("fs");

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
      const mainBuffer = await fs.promises.readFile("./src/assets/img/view.png");

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
