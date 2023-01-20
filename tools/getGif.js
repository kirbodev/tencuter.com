const fetch = require("node-fetch");
const imagemin = require("imagemin");
const imageminGifsicle = require("imagemin-gifsicle");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/**
 * 
 * @param {String} url A URL to a tenor gif 
 * @returns {Promise<Buffer>} A compressed buffer of the gif
 */
async function getGif(url) {
    const response = await fetch(url);
    if (response.status !== 200) {
        return null;
    }
    const text = await response.text();
    const dom = new JSDOM(text);
    const link = dom.window.document.querySelector("link[rel='image_src']");
    if (!link) {
        return null;
    }
    const result = await fetch(link.href);
    const buffer = await result.buffer();
    const compressed = await imagemin.buffer(buffer, {
        plugins: [imageminGifsicle({ interlaced: true })],
    });

    return compressed;
}

module.exports = getGif