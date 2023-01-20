/**
 * @description Returns HTML with the image as the body, used for image previews with link shown on Discord
 * @param {String} imageURL
 * @param {Boolean} base64
 * @param {Boolean} headonly
 * @param {Boolean} issues
 * @returns {String} string
 */
function ImageAsHTML(
  imageURL,
  base64 = false,
  headonly = false,
  issues = true
) {
  if (base64) {
    imageURL = `data:image/png;base64,${imageURL}`;
  }
  var html = `<html>
    <head>
        <meta name="twitter:image" content="${imageURL}" />
        <meta name="twitter:card" content="summary_large_image" />
    </head>
    <body style="margin:0;">
        <img src="${imageURL}" style="width: min(100vw, 100vh);" />
    </body>
    </html>`;
  if (issues) {
    html = `<html>
      <head>
          <meta name="twitter:image" content="${imageURL}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta http-equiv="refresh" content="0; url=https://github.com/kirbodev/tencuter.com/issues" />
      </head>
      <body style="margin:0;">
          <a href="https://github.com/kirbodev/tencuter.com/issues">Click here if you aren't redirected automatically</a>
      </body>
    </html>`;
  }
  else if (headonly) {
    html = `<head>
        <meta name="twitter:image" content="${imageURL}" />
        <meta name="twitter:card" content="summary_large_image" />
        </head>`;
  }
  return html;
}

module.exports = ImageAsHTML;
