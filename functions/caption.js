const fetch = require("isomorphic-fetch");
const puppeteer = require("puppeteer");
const caption = require("../tools/caption");

module.exports.handler = async (event, context, callback) => {
  try {
    const gif = event.path.split("/")[5];
    const captionText = event.path.split("/")[4];
    const gifurl = await fetch(`https://tenor.com/view/${gif}`);
    const resultText = await gifurl.text();
    const resultGif = resultText.match(/https:\/\/media.tenor.com\/[a-z0-9]+/i)[0];
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
      deviceScaleFactor: 1,
    })
    await page.setContent(caption(captionText, resultGif))
    const image = await page.screenshot({
      type: "png",
      encoding: "base64",
    });
    await browser.close();
    callback(null, {
      statusCode: 200,
      body: image,
      headers: {
        "Content-Type": "image/png",
      },
      isBase64Encoded: true,
    });
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: `Something went wrong: ${e}`,
    });
  }
};