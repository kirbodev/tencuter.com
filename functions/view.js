const fetch = require("isomorphic-fetch");

// Get splat after /view
module.exports.handler = async (event, context, callback) => {
  try {
    const result = await fetch("https://i.ibb.co/9GSjhyR/So-Cute-Main.png");
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
  // const gif = event.path.split("/").pop();
  // axios.get(`https://tenor.com/view/${gif}`)
  //     .then(res => {
  //         // Find the url of the first gif
  //         const url = res.data.match(/https:\/\/media.tenor.com\/[a-z0-9]+/i)[0];
  //         // Get the base link of the website and go to /assets/SoCuteMain.png
  //     })
  //     .catch(err => {
  //         callback(null, {
  //             statusCode: 404,
  //             body: `Error: ${err}`
  //         })
  //     })
};
