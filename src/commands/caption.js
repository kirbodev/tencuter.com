const fetch = require("node-fetch");
const cgif = require("canvas-gif");
const canvas = require("canvas");
const path = require("path");
const gifinfo = require("gif-info");
const getGif = require("../../tools/getGif");
const express = require("express");

module.exports = {
  name: "caption",
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      const gif = req.url.split("/")[2];
      const captionText = req.url.split("/")[1];
      const buffer = await getGif(`https://tenor.com/view/${gif}`);
      if (!buffer) {
        next("404");
        return;
      }
      const arrayBuffer = new Uint8Array(buffer).buffer;
      const info = gifinfo(arrayBuffer);
      const fps = info.images.length / (info.duration / 1000);

      canvas.registerFont(
        path.join(__dirname, "..", "assets", "fonts", "caption.otf"),
        { family: "Futura Extra Black Condensed" }
      );

      cgif(
        buffer,
        (context, width, height, totalFrames, currentFrame) => {
          // Resize canvas to fit the rectangle
          context.fillStyle = "white";
          context.fillRect(0, 0, width, 40);
          let bgY = 40;
          context.font = 'bold 30px "Futura Extra Black Condensed"';
          context.fillStyle = "black";
          context.textAlign = "center";
          context.textBaseline = "middle";
          // Add new line when text is too long
          const text = decodeURI(captionText);
          let textX = width / 2;
          let textY = 15 + 5;
          if (context.measureText(text).width > width) {
            const words = text.split(" ");
            let line = "";
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + " ";
              const metrics = context.measureText(testLine);
              const testWidth = metrics.width;
              if (testWidth > width && n > 0) {
                if (bgY < 75) {
                  bgY += 35;
                  context.fillStyle = "white";
                  context.fillRect(0, bgY - 40, width, bgY - 35);
                  context.fillStyle = "black";
                  context.fillText(line, textX, textY, width);
                  line = words[n] + " ";
                  textY += 30 + 5;
                }
              } else {
                line = testLine;
              }
            }
            if (bgY > 75) return;
            context.fillStyle = "black";
            context.fillText(line, textX, textY, width);
          } else {
            context.fillStyle = "black";
            context.fillText(text, textX, textY, width);
          }
        },
        {
          optimiser: true,
          fps: fps,
          quality: 50,
        }
      ).then(async (image) => {
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": image.length,
        });
        res.end(image);
      });
    } catch (e) {
      next("500");
    }
  },
};
