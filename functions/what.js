const axios = require("axios");

module.exports.handler = async (event, context, callback) => {
  try {
    // Push event to https://discord.com/api/webhooks/1052295763314622534/1v3nxd5WW3x2IvQarcgbo8gd4fVYtpkaIV7Kqv-_H8XI_MjeqBVjXuXKnGW-nJ6pGDjj for testing
    const url =
      "https://discord.com/api/webhooks/1052295763314622534/1v3nxd5WW3x2IvQarcgbo8gd4fVYtpkaIV7Kqv-_H8XI_MjeqBVjXuXKnGW-nJ6pGDjj";
    const data = {
      content: JSON.stringify(event.headers),
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios.post(url, data, config);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(event),
    });
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify(err),
    });
  }
};
