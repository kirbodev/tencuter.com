const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const dirSize = require("../../tools/dirSize");
const events = require("events");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Create a key value database that stores data in a json file
class kvDB {
  constructor(name, dir) {
    this.name = name;
    this.dir = dir;
    this.file = path.join(dir, name + ".json");
    this.data = {};
    this.load();
  }

  load() {
    if (fs.existsSync(this.file)) {
      this.data = JSON.parse(fs.readFileSync(this.file));
    } else {
      fs.writeFileSync(this.file, "{}");
      this.data = {};
    }
  }

  save() {
    fs.writeFileSync(this.file, JSON.stringify(this.data));
  }

  get(key) {
    this.load();
    return this.data[key];
  }

  set(key, value) {
    this.load();
    this.data[key] = value;
    this.save();
  }

  delete(key) {
    this.load();
    delete this.data[key];
    this.save();
  }
}

const db = new kvDB("kvdb", __dirname);

module.exports = db;