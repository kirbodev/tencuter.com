function ImageAsHTML(imageURL) {
    var html = `<html>
    <head>
        <meta name="twitter:image" content="${imageURL}" />
        <meta name="twitter:card" content="summary_large_image" />
    </head>
    <body>
        <img src="${imageURL}" />
    </body>
    </html>`;
    return html;
}

module.exports = ImageAsHTML