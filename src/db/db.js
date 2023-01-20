const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const dirSize = require("../../tools/dirSize");
const events = require("events");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

let maxSizeBehaviours = ["clear", "error", "clearOldest"];

/**
 * @name MediaDB
 * @description A simple database for linking keys to a file
 * @param {String} path The path to the database
 * @param {Object} options
 * @param {String} options.savePath The path to the save file (defaults to ./save.json)
 * @param {Number} options.maxSize The maximum size of the database in bytes (defaults to unlimited)
 * @param {String} options.maxSizeBehaviour The behaviour when the database exceeds the maximum size (defaults to "error") (clear, error, clearOldest)
 * @param {Boolean} options.saveInternally Whether to save the database internally, aka not saving a file but saving the data in a base64 format inside the save file (defaults to false)
 * @example
 * const db = new MediaDB({ savePath: "./db.json", maxSize: 100000000, maxSizeBehaviour: "clearOldest", saveInternally: false }); // Creates a new database with a save file at ./db.json, a maximum size of 100MB, a maximum size behaviour of clearing the oldest file, and saving the database externally
 * @copyright Made by myself, kirbodev. This database was made for this project specifically and doesn't follow the same copyright as the rest of the project, use this in your own projects if you want, no need to credit me! Licensed under WTFPL (http://www.wtfpl.net/txt/copying/)
 */
class MediaDB {
  constructor(path, options) {
    if (!path || typeof path !== "string")
      throw new Error("MediaDB: No path provided or path is invalid");
    if (options && typeof options !== "object")
      throw new Error("MediaDB: Options is invalid");
    if (options && options.savePath && typeof options.savePath !== "string")
      throw new Error("MediaDB: Save path is invalid");
    if (options && options.maxSize && typeof options.maxSize !== "number")
      throw new Error("MediaDB: Max size is invalid");
    if (
      options &&
      options.maxSizeBehaviour &&
      typeof options.maxSizeBehaviour !== "string" &&
      maxSizeBehaviours.indexOf(options.maxSizeBehaviour) === -1
    )
      throw new Error("MediaDB: Max size behaviour is invalid");
    if (
      options &&
      options.saveInternally &&
      typeof options.saveInternally !== "boolean"
    )
      throw new Error("MediaDB: Save internally is invalid");

    this.path = path;
    this.db = {};
    this.options = options || {};
    this.options.savePath =
      options.savePath || path.join(__dirname, "save.json");
    this.options.maxSizeBehaviour = this.options.maxSizeBehaviour || "error";
    this.options.saveInternally = this.options.saveInternally || false;
    this.ready = false;
    this.events = new events.EventEmitter();
    (async () => {
      if (!fs.existsSync(path)) {
        console.log(
          chalk.bold(chalk.yellow("MediaDB:")) +
            " Path doesn't exist, creating it..."
        );
        fs.mkdirSync(path);
      }
      if (!fs.lstatSync(path).isDirectory()) {
        throw new Error("MediaDB: Path is not a directory");
      }
      if (!this.options.savePath.endsWith(".json")) {
        throw new Error("MediaDB: Save path is not a json file");
      }
      if (!fs.existsSync(this.options.savePath)) {
        console.log(
          chalk.bold(chalk.bold(chalk.yellow("MediaDB:"))) +
            " Save path doesn't exist, creating it..."
        );
        fs.writeFileSync(this.options.savePath, "{}");
      }
      this.db = JSON.parse(fs.readFileSync(this.options.savePath));
      if (this.options.maxSize) {
        await spaceCheck.bind(this)();
      }
      this.ready = true;
      this.events.emit("ready");
    }).bind(this)();
  }

  /**
   *
   * @description Sets the saved data to the data inside the JSON file (This is mostly done automatically)
   * @returns {Promise<Boolean>}
   */
  async read() {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    this.db = JSON.parse(fs.readFileSync(this.options.savePath));
    return true;
  }

  /**
   * @description Gets a file from the database and returns it as a buffer
   * @param {String} key
   * @returns {Promise<Buffer>}
   * @example
   * const db = new MediaDB({ savePath: "./db.json", saveInternally: true });
   * db.events.on("ready", async () => {
   *  console.log(await db.get("key")); // null
   *  await db.set("key", { name: "test.png", data: "test" });
   *  console.log(await db.get("key")); // <Buffer 74 65 73 74>
   * });
   */
  async get(key) {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    if (!key || typeof key !== "string")
      throw new Error("MediaDB: Key is invalid");
    await this.read();
    if (!this.db[key]) return null;
    if (this.options.saveInternally) {
      return Buffer.from(this.db[key], "base64");
    } else {
      if (!fs.existsSync(this.db[key])) {
        delete this.db[key];
        this.save();
        return null;
      }
      return fs.readFileSync(this.db[key]);
    }
  }

  /**
   * @description Links a key to a file or saves the file internally if saveInternally is true
   * @param {String} key
   * @param {{name:String,data:String|Buffer}} file
   * @returns {Promise<Boolean>}
   * @example
   * const db = new MediaDB({ savePath: "./db.json", saveInternally: true });
   * db.events.on("ready", async () => {
   *  console.log(await db.has("key")); // false
   *  await db.set("key", { name: "test.png", data: "test" });
   *  console.log(await db.has("key")); // true
   * });
   */
  async set(key, file) {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    if (!key || typeof key !== "string")
      throw new Error("MediaDB: Key is invalid");
    if (!file || typeof file !== "object")
      throw new Error("MediaDB: File is invalid");
    if (!file.name || typeof file.name !== "string")
      throw new Error("MediaDB: File name is invalid");
    if (
      !file.data ||
      (typeof file.data !== "string" && !Buffer.isBuffer(file.data))
    )
      throw new Error("MediaDB: File data is invalid");
    if (this.options.maxSize) {
      if (!(await spaceCheck.bind(this)()))
      throw new Error("MediaDB: No space left!");
    }
    let data;
    if (this.options.saveInternally) {
      if (Buffer.isBuffer(file.data)) {
        this.db[key] = file.data.toString("base64");
        this.save();
      } else {
        this.db[key] = file.data;
        this.save();
      }

      return true;
    } else {
      if (Buffer.isBuffer(file.data)) {
        data = file.data;
      } else {
        data = Buffer.from(file.data);
      }
      fs.writeFileSync(path.join(this.path, file.name), data);
      this.db[key] = path.join(this.path, file.name);

      this.save();
      return true;
    }
  }

  /**
   * @description Deletes a key from the database, if saveInternally is true, it will delete the key from the database, if saveInternally is false, it will delete the file from the path and then delete the key from the database
   * @param {String} key
   * @returns {Boolean}
   * @example
   * const db = new MediaDB({ savePath: "./db.json", saveInternally: true });
   * db.events.on("ready", async () => {
   *  console.log(await db.delete("key")); // false
   *  await db.set("key", { name: "test.png", data: "test" });
   *  console.log(await db.delete("key")); // true
   *  console.log(await db.get("key")); // null
   * });
   */
  async delete(key) {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    if (!key || typeof key !== "string")
      throw new Error("MediaDB: Key is invalid");
    await this.read();
    if (!this.db[key]) return false;
    if (this.options.saveInternally) {
      delete this.db[key];
      this.save();
      return true;
    } else {
      if (!fs.existsSync(this.db[key])) {
        delete this.db[key];
        this.save();
        return true;
      }
      fs.unlinkSync(this.db[key]);
      delete this.db[key];
      this.save();
      return true;
    }
  }

  /**
   *
   * @description Returns the database object
   * @returns {Object}
   * @example
   * const db = new MediaDB({ savePath: "./db.json", saveInternally: true });
   * db.events.on("ready", async () => {
   *  console.log(await db.all());
   * // If saveInternally is true, it will return something like this:
   * // {
   * //   "key": "base64 data"
   * // }
   * // If saveInternally is false, it will return something like this:
   * // {
   * //   "key": "path/to/file"
   * // }
   * });
   */
  async all() {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    await this.read();
    return this.db;
  }

  /**
   * @description Warning! While clear only deletes the saved data, deleteFiles deletes the files too!
   * @param {Boolean} deleteFiles
   * @returns {Boolean}
   */
  async clear(deleteFiles) {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    this.db = {};
    if (deleteFiles) {
      fs.rmSync(this.options.savePath);
      fs.rmdirSync(this.path, { recursive: true });
      fs.mkdirSync(this.path);
    }
    return true;
  }

  /**
   *
   * @param {String} key
   * @returns {Boolean}
   * @description Returns true if the key exists, false if it doesn't
   * @example
   * const db = new MediaDB({ savePath: "./db.json", saveInternally: true });
   * db.events.on("ready", async () => {
   *  console.log(await db.has("key")); // false
   *  await db.set("key", { name: "test.png", data: "test" });
   *  console.log(await db.has("key")); // true
   * });
   *
   */
  async has(key) {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    if (!key || typeof key !== "string")
      throw new Error("MediaDB: Key is invalid");
    await this.read();
    if (!this.db[key]) return false;
    if (this.options.saveInternally) {
      return true;
    } else {
      if (!fs.existsSync(this.db[key])) {
        delete this.db[key];
        this.save();
        return false;
      }
      return true;
    }
  }

  /**
   * 
   * @description Saves the database to the savePath (This is mostly done automatically)
   * @returns {Boolean}
   */
  async save() {
    if (!this.ready) throw new Error("MediaDB: Database is not ready");
    fs.writeFileSync(this.options.savePath, JSON.stringify(this.db));
    return true;
  }
}

async function spaceCheck() {
  const path = this.path;
  const size = await dirSize(path);
  if (size > this.options.maxSize) {
    let result;
    switch (this.options.maxSizeBehaviour) {
      case "clear":
        console.log(
          chalk.bold(chalk.bold(chalk.yellow("MediaDB:"))) +
            " Max size exceeded, clearing database..."
        );
        fs.rmdirSync(path, { recursive: true });
        fs.mkdirSync(path);
        result = true;
        break;
      case "clearOldest":
        console.log(
          chalk.bold(chalk.bold(chalk.yellow("MediaDB:"))) +
            " Max size exceeded, clearing oldest files..."
        );
        const files = await readdir(path);
        files.sort((a, b) => {
          return (
            fs.statSync(path + "/" + a).mtimeMs -
            fs.statSync(path + "/" + b).mtimeMs
          );
        });
        let size = 0;
        for (const file of files) {
          size += fs.statSync(path + "/" + file).size;
        }
        while (size > this.options.maxSize - 10000000) {
          const file = files.shift();
          size -= fs.statSync(path + "/" + file).size;
        }
        for (const file of files) {
          fs.unlinkSync(path + "/" + file);
        }
        result = true;
        break;
      case "error":
        console.warn(
          `${chalk.bold(
            chalk.yellow("MediaDB:")
          )} Max size exceeded, reading is allowed but writing will be disabled.`
        );
        result = false;
        break;
    }
    return result;
  } else {
    return true;
  }
}

const db = new MediaDB(path.join(__dirname, "cache"), {
  savePath: path.join(__dirname, "db.json"),
  saveInternally: false,
  maxSize: 10000000000,
  maxSizeBehaviour: "clearOldest",
});

db.events.on("ready", async () => {
  console.log(`${chalk.bold(chalk.yellow("MediaDB:"))} Ready!`);
});

module.exports = db;
