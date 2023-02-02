const express = require("express");
const chalk = require("chalk");
const db = require("./db/db");
const kvdb = require("./db/kvdb");
const rdb = require("./data/index");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

require("dotenv").config();

const app = (module.exports = express());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "web", "index.html"));

  const visit = await rdb.get(`webvisits-${req.ip}`);
  if (!visit) {
    rdb.set(`webvisits-${req.ip}`, 1);
  } else {
    rdb.set(`webvisits-${req.ip}`, parseInt(visit) + 1);
  }
});

app.use(express.static(path.join(__dirname, "web")));

app.use("/analytics", express.static(path.join(__dirname, "data", "web")));

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

app.get("/api/data/all", async (req, res) => {
  // Get amount of visits
  let totalvisits = 0;
  const visits = await rdb.keys("webvisits-*");
  for (const visit of visits) {
    const vst = await rdb.get(visit);
    totalvisits += parseInt(vst);
  }
  // Get amount of unique visits
  const uniquevisits = visits.length;
  // Get amount of shortened URLs
  const shortURLs = kvdb.all("short-*");
  const shortURLCount = shortURLs.length;
  // Get amount of overall usage
  let usageCount = 0;
  const usage = await rdb.keys("uses-*");
  for (const use of usage) {
    const usg = await rdb.get(use);
    usageCount += parseInt(usg);
  }
  // Get amount of usage per command
  let cmdusage = {};
  for (const cmd of await rdb.keys("uses-*")) {
    const cmdname = cmd.split("-")[1];
    for (const cmd of await rdb.keys(`uses-${cmdname}`)) {
      const cmduses = await rdb.get(cmd);
      cmdusage[cmdname] = cmduses;
    }
  }

  res.send({
    totalvisits,
    uniquevisits,
    shortURLCount,
    usageCount,
    cmdusage,
  });
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
