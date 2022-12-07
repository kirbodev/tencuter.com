function ImageAsHTML(imageURL) {
    var html = `<html>
    <head>
        <meta name="twitter:card" content="${imageURL}" />
        <meta name="og:image" content="${imageURL}" />
    </head>
    <body>
        <img src="${imageURL}" />
    </body>
    </html>`;
    return html;
}

module.exports = ImageAsHTML