const express = require("express");
const createEmbed = require("../../tools/createEmbed");
const responses = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Better not tell you now.",
  "Ask again later.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "Outlook not so good.",
  "My sources say no.",
  "Very doubtful.",
  "My reply is no.",
];

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = {
  name: "8ball",
  imgOnly: true,
  handler: async (req, res, next) => {
    try {
      const response = responses[Math.floor(Math.random() * responses.length)];
      const embed = createEmbed({
        title: "The magic 8ball says...",
        author: {
          name: "s/o/cute",
          url: "https://tencuter.com/",
        },
        description: response,
        color: "#ff7f5a",
        image: "https://tencuter.com/assets/img/8ball.png",
      });
      res.status(200).send(`
        <html>
          <head>
          <link rel="stylesheet" href="/assets/css/8ball.css" />
            ${embed}
          </head>
          <body>
          <div>
            <h1>The magic 8ball says...</h1>
            <p>${response}</p>
            </div>
          </body>
          </html>
      `);
    } catch (e) {
      next("500");
    }
  },
};
