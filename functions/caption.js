const fetch = require("isomorphic-fetch");
const cgif = require("canvas-gif");
const gifinfo = require("gif-info");

// Install Futura Extra Black Condensed font to your system using install-fonts package
const font = require("install-fonts");
font({
  scope: "system",
  recurseDirs: "./functions/fonts"
})

module.exports.handler = async (event, context, callback) => {
  try {
    const gif = event.path.split("/")[5];
    const captionText = event.path.split("/")[4];
    const gifurl = await fetch(`https://tenor.com/view/${gif}`);
    const resultText = await gifurl.text();
    const resultGif = resultText.match(
      /https:\/\/media.tenor.com\/[a-z0-9]+/i
    )[0];
    const result = await fetch(resultGif);
    const buffer = await result.buffer();
    const arrayBuffer = new Uint8Array(buffer).buffer;
    const info = gifinfo(arrayBuffer);
    const fps = info.images.length / (info.duration / 1000);

    cgif(
      buffer,
      (context, width, height, totalFrames, currentFrame) => {
        // Resize canvas to fit the rectangle
        context.fillStyle = "white";
        context.fillRect(0, 0, width, 40);
        let bgY = 40;
        context.font = 'bold 30px "Futura Extra Black Condensed"';
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        // Add new line when text is too long
        const text = decodeURI(captionText);
        let textX = width / 2;
        let textY = 15 + 5;
        if (context.measureText(text).width > width) {
          const words = text.split(" ");
          let line = "";
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > width && n > 0) {
              bgY += 35;
              context.fillStyle = "white";
              context.fillRect(0, 0, width, bgY);
              context.fillStyle = "black";
              context.fillText(line, textX, textY);
              line = words[n] + " ";
              textY += 30 + 5;
            } else {
              line = testLine;
            }
          }
          context.fillText(line, textX, textY, width);
        } else {
          context.fillText(text, textX, textY, width);
        }
      },
      {
        optimiser: true,
        fps: fps,
        quality: 50,
      }
    ).then((image) => {
      callback(null, {
        statusCode: 200,
        body: image.toString("base64"),
        headers: {
          "Content-Type": "image/gif",
        },
        isBase64Encoded: true,
      });
    });
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: `Something went wrong: ${e}`,
    });
  }
};
