const fetch = require("isomorphic-fetch");
const cgif = require("canvas-gif");
const gifinfo = require("gif-info");

module.exports.handler = async (event, context, callback) => {
  try {
    const gif = event.path.split("/")[5];
    const captionText = event.path.split("/")[4];
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
              if (bgY < 75) {
                bgY += 35;
                context.fillStyle = "white";
                context.fillRect(0, bgY - 40, width, bgY - 35);
                context.fillStyle = "black";
                context.fillText(line, textX, textY, width);
                console.log(
                  "line: " + line + " textY: " + textY + " bgY: " + bgY
                );
                line = words[n] + " ";
                textY += 30 + 5;
              }
            } else {
              line = testLine;
            }
          }
          if (bgY > 75) return;
          context.fillStyle = "black";
          context.fillText(line, textX, textY, width);
        } else {
          context.fillStyle = "black";
          context.fillText(text, textX, textY, width);
        }
      },
      {
        optimiser: true,
        fps: fps,
        quality: 50,
      }
    ).then(async (image) => {
      // Check if its bigger than 6MB
      if (image.length > 6291456) {
        const tooBig = await fetch("https://tencuter.com/assets/img/413.png");
        const buffer = await tooBig.buffer();
        callback(null, {
          statusCode: 413,
          headers: {
            "Content-Type": "image/png",
          },
          body: buffer.toString("base64"),
          isBase64Encoded: true,
        });
      } else {
        callback(null, {
          statusCode: 200,
          headers: {
            "Content-Type": "image/gif",
          },
          body: image.toString("base64"),
          isBase64Encoded: true,
        });
      }
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
