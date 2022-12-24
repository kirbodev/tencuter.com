const fetch = require("isomorphic-fetch");

module.exports.handler = async (event, context, callback) => {
  try {
    const image = await fetch("https://i.ibb.co/nQG4pq3/So-Cute-What.png");
    const imageData = await image.buffer();
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
      },
      body: imageData.toString("base64"),
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