const fetch = require("isomorphic-fetch");

// Get splat after /view
module.exports.handler = async (event, context, callback) => {
  try {
    const result = await fetch("https://i.ibb.co/P9RJp43/So-Cute-Main.png");
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
    callback(null, {
        statusCode: 500,
        body: `Something went wrong: ${e}`
    })
  }
};
