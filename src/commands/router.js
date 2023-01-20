const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const createEmbed = require("../../tools/createEmbed.js");
const shortURL = require("../../tools/shortenURL.js");
require("dotenv").config();

(async () => {
  const commands = await readdir(path.join(__dirname, "..", "commands"));

  for (const command of commands) {
    const commandFile = require(path.join(
      __dirname,
      "..",
      "commands",
      command
    ));
    const commandName = commandFile.name;
    const commandHandler = commandFile.handler;

    if (command === "router.js") {
      continue;
    }
    if (!commandName) {
      console.log(
        `${chalk.bold(
          chalk.red("Command Error:")
        )} ${command} does not have a name`
      );
    }
    if (!commandHandler) {
      console.log(
        `${chalk.bold(
          chalk.red("Command Error:")
        )} ${command} does not have a handler`
      );
    }
    if (typeof commandHandler !== "function") {
      console.log(
        `${chalk.bold(
          chalk.red("Command Error:")
        )} ${command} does not have a valid handler`
      );
    }
    if (!commandName || !commandHandler) {
      continue;
    }
    router.use(`/api/${commandName}`, commandHandler);
    console.log(`${chalk.bold(chalk.green("Command:"))} ${commandName} loaded`);

    if (commandFile.imgOnly) {
      router.use(`/${commandName}`, (req, res) => {
        res.redirect(
          `/api/${commandName}${req.url.replace(`/${commandName}/`, "")}`
        );
      });
    } else {
      router.use(`/${commandName}`, async (req, res) => {
        const short = await shortURL(
          `${process.env.DOMAIN_NAME}/api/${commandName}${req.url.replace(
            `/${commandName}/`,
            ""
          )}`
        );
        const commandEmbed = createEmbed({
          title: commandName,
          description: `Your gif has been processed. Click the image to view it or click the link above to download it.\nShort URL: ${short}`,
          image: `${
            process.env.DOMAIN_NAME
          }/api/${commandName}${req.url.replace(`/${commandName}/`, "")}`,
          author: {
            name: "Click here to download",
            url: `${
              process.env.DOMAIN_NAME
            }/api/${commandName}${req.url.replace(`/${commandName}/`, "")}`,
          },
        });
        res.send(commandEmbed);
      });
    }
  }
})();

module.exports = router;
