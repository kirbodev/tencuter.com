const sharp = require('sharp');
const jimp = require('jimp');
const fetch = require("isomorphic-fetch");
const path = require('path');

module.exports.handler = async (event, context, callback) => {
    const gif = event.path.split("/").pop();
    const gifurl = await fetch(`https://tenor.com/view/${gif}`);
    const resultText = await gifurl.text();
    const resultGif = resultText.match(/https:\/\/media.tenor.com\/[a-z0-9]+/i)[0];
    const result = await fetch(resultGif);
    const buffer = await result.buffer();
    const image = await jimp.read(buffer);
    const bg = await jimp.read(path.join(__dirname, "..", "assets", "img", "trash.png"));
    image.resize(195, 195);
    bg.composite(image, 120, 135);
    const data = await bg.getBufferAsync(jimp.MIME_PNG);

    callback(null, {
        statusCode: 200,
        headers: {
            "Content-Type": "image/png",
        },
        body: data.toString("base64"),
        isBase64Encoded: true,
    });
};