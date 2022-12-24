const fetch = require("node-fetch");

module.exports.handler = async (event, context, callback) => {
  try {
    // Get a random dog image
    const result1 = await fetch("https://dog.ceo/api/breeds/image/random");
    const resultURL = await result1.json();
    const result = await fetch(resultURL.message);
    const buffer = await result.buffer();

    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
      },
      body: buffer.toString("base64"),
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
