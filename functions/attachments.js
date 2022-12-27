const fetch = require("isomorphic-fetch");

module.exports.handler = async (event, context, callback) => {
  try {
    const main = await fetch("https://i.ibb.co/6WjStY3/So-Cute-Secondary.png");
    const mainBuffer = await main.buffer();

    callback(null, {
        statusCode: 200,
        headers: {
            "Content-Type": "image/png",
        },
        body: mainBuffer.toString("base64"),
        isBase64Encoded: true,
    });
  } catch (e) {
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