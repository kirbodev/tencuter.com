const fetch = require("isomorphic-fetch");
const jimp = require("jimp");

module.exports.handler = async (event, context, callback) => {
  try {
    // Deepfry the image
    const gif = event.path.split("/").pop();
    const gifurl = await fetch(`https://tenor.com/view/${gif}`);
    const resultText = await gifurl.text();
    const resultGif = resultText.match(/https:\/\/media.tenor.com\/[a-z0-9]+/i)[0];
    const result = await fetch(resultGif);
    const buffer = await result.buffer();
    const image = await jimp.read(buffer);
    // Resize to 1080, 1080, pixelate slightly, set contrast to 0.95 and posterize to 8. Then, sharpen the image. Then, make it very low quality. Then, make it very high quality.
    image.resize(1080, 1080).pixelate(2).contrast(0.95).posterize(8).quality(1).quality(100);
    const data = await image.getBufferAsync(jimp.MIME_JPEG);

    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: data.toString("base64"),
      isBase64Encoded: true,
    });
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: `Something went wrong: ${e}`,
    });
  }
};