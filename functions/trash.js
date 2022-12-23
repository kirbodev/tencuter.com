const jimp = require("jimp");
const fetch = require("isomorphic-fetch");

module.exports.handler = async (event, context, callback) => {
  try {
    const gif = event.path.split("/").pop();
    const gifurl = await fetch(`https://tenor.com/view/${gif}`);
    const resultText = await gifurl.text();
    const resultGifList = resultText.match(
      /https:\/\/media.tenor.com\/[a-z0-9]+/i
    );
    if (!resultGifList) {
      const notFound = await fetch("https://tencuter.com/assets/img/404.png");
      const buffer = await notFound.buffer();
      callback(null, {
        statusCode: 404,
        headers: {
          "Content-Type": "image/png",
        },
        body: buffer.toString("base64"),
        isBase64Encoded: true,
      });
    }
    const resultGif = resultGifList[0];
    const result = await fetch(resultGif);
    const buffer = await result.buffer();

    const trashimg = await fetch("https://tencuter.com/assets/img/trash.png");
    const trashbuffer = await trashimg.buffer();

    const frame = await jimp.read(buffer);
    const trash = await jimp.read(trashbuffer);

    frame.resize(195, 195);
    trash.composite(frame, 135, 135);

    const data = await trash.getBufferAsync(jimp.MIME_GIF);

    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "image/gif",
      },
      body: data.toString("base64"),
      isBase64Encoded: true,
    });
  } catch (e) {
    console.log(e);
    const imageAsHTML = require("../tools/HTMLImage");
    callback(null, {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
      },
      body: imageAsHTML("https://tencuter.com/assets/img/500.png"),
    });
  }
};
