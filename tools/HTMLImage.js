/**
 * @description Returns HTML with the image as the body, used for image previews with link shown on Discord
 * @param {String} imageURL
 * @param {Boolean} base64
 * @param {Boolean} headonly
 * @returns {String} string
 */
function ImageAsHTML(imageURL, base64 = false, headonly = false) {
  if (base64) {
    imageURL = `data:image/png;base64,${imageURL}`;
  }
  var html = `<html>
    <head>
        <meta name="twitter:image" content="${imageURL}" />
        <meta name="twitter:card" content="summary_large_image" />
    </head>
    <body>
        <img src="${imageURL}" />
    </body>
    </html>`;
  if (headonly) {
    html = `<head>
        <meta name="twitter:image" content="${imageURL}" />
        <meta name="twitter:card" content="summary_large_image" />
        </head>`;
  }
  return html;
}

module.exports = ImageAsHTML;
