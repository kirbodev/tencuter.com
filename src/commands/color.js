const fetch = require("node-fetch");
const kvDB = require("../db/kvdb");
const crypto = require("crypto");
const express = require("express");
const createEmbed = require("../../tools/createEmbed");

module.exports = {
  name: "color",
  imgOnly: true,
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  handler: async (req, res, next) => {
    try {
      let color;
      const hash = crypto
        .createHash("sha256")
        .update(req.url)
        .digest("hex")
        .slice(0, 6);
      const cached = await kvDB.get(`color-${hash}`);
      if (cached) color = cached;
      else {
        color = randomColor();
      }

      console.log(color);

      kvDB.set(`color-${hash}`, color);

      const result = await fetch(`https://www.thecolorapi.com/id?hex=${color}`);
      const resultJSON = await result.json();
      console.log(resultJSON);
      const embed = createEmbed({
        title: `Color | ${color}`,
        author: {
          name: "s/o/cute",
          url: "https://tencuter.com/",
        },
        description: `Your random color is ${color}. It's name is ${resultJSON.name.value}.`,
        color: color,
        image: resultJSON.image.bare,
      });

      res.status(200).send(`
        <html>
            <head>
                <link rel="stylesheet" href="/assets/css/color.css">
                ${embed}
            </head>
            <body style="background-color: #${color};">
                <div class="color" style="color: ${resultJSON.contrast.value};">
                    <h1>${color}</h1>
                    <p>${resultJSON.name.value}</p>
                </div>
            </body>
        </html>
        `);
    } catch (e) {
      next("500");
    }
  },
};

function randomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}
