function generateHTML(text, imageURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <style>
          /* Import Futura font from otf file */
          @font-face {
              font-family: 'Futura';
              src: url('https://tencuter.com/assets/fonts/caption.otf');
          }
  
          :root {
              --character-count: ${text.length};
          }
  
          body {
              background-color: #fff;
              margin: 0;
              padding: 0;
              overflow: hidden;
          }
  
          *,
          *:before,
          *:after {
              box-sizing: border-box;
          }
  
          .text {
              font-family: 'Futura';
              font-size: calc(6em - var(--character-count) * 0.03em);
              color: #000;
              text-align: center;
              margin: auto;
              padding: 0;
              text-align: center;
              display: block;
              overflow-wrap: break-word;
              word-wrap: break-word;
              -ms-word-break: break-all;
              word-break: break-all;
          }
  
          .text-container {
              width: 100%;
              background-color: #fff;
              z-index: 1;
          }
  
          .image {
              width: 100%;
              height: calc(100vh - 6em + var(--character-count) * 0.03em);
              object-fit: cover;
              object-position: center;
          }
      </style>
  </head>
  
  <body>
      <div class="text-container">
          <h1 class="text">${text}</h1>
      </div>
      <img class="image"
          src="${imageURL}">
  </body>
  
  </html>
  `;
}

module.exports = generateHTML;