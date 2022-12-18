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
    callback(null, {
      statusCode: 500,
      body: `Something went wrong: ${e}`,
    });
  }
};
