const fetch = require("node-fetch");

async function randomMeme() {
    const meme = await fetch("https://reddit.com/r/memes/random/.json");
    const memeJson = await meme.json();
    const memeUrl = memeJson[0].data.children[0].data.url;
    if (!memeUrl) return await randomMeme();
    if (memeJson[0].data.children[0].data.over_18) return await randomMeme();
    const memeImage = await fetch(memeUrl);
    const memeBuffer = await memeImage.buffer();

    return {buffer: memeBuffer.toString("base64"), url: memeUrl};
}

module.exports = randomMeme;