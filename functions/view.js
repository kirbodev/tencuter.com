

// Get splat after /view
module.exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: "https://tencuter.com/assets/SoCuteMain.png",
  });
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
