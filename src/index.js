const express = require("express");
const chalk = require("chalk");
const db = require("./db/db");
const kvdb = require("./db/kvdb");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

require("dotenv").config();

const app = (module.exports = express());

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "web")));

const commandRouter = require("./commands/router");
app.use(commandRouter);

app.get("/api/shorten/:url", (req, res) => {
  const url = req.params.url;
  const key = req.query.apiKey;
  if (key !== process.env.KVDB_KEY) {
    res.status(403).send("Trying to bypass the key? Nice try.");
    return;
  }
  const newURL = kvdb.get(url);
  if (newURL) {
    res.send(newURL);
    return;
  }
  const hash = crypto
    .createHash("sha256")
    .update(url)
    .digest("hex")
    .slice(0, 6);
  kvdb.set(`short-${hash}`, url);
  res.send(`${process.env.DOMAIN_NAME}/s/${hash}`);
});

app.get("/s/:hash", (req, res) => {
  const hash = req.params.hash;
  const url = kvdb.get(`short-${hash}`);
  if (url) {
    res.redirect(url);
    return;
  }
  res
    .status(404)
    .send("Looks like you tried to access a short URL that doesn't exist.");
});

app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "errors", "404.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "ssl", "privkey.pem")),
      cert: fs.readFileSync(path.join(__dirname, "ssl", "fullchain.pem")),
    },
    app
  )
  .listen(443, () => {
    console.log(
      chalk.bold(chalk.green("HTTPS Server:")) + " Listening on port 443"
    );
  });