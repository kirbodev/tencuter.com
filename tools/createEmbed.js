/**
 * @description Creates HTML code for a discord embed
 * @param {{
 * title: String,
 * description: String,
 * color: String,
 * image: String,
 * author: {
 * name: String,
 * url: String
 * }
 * }} options - The options for the embed
 */
function createEmbed(options) {
    let { title, description, color, image, author } = options;
    if (!title) title = "No title provided.";
    if (!description) description = "No description provided.";
    if (!color) color = "#ff7f5a";
    if (!author) author = { name: "", url: "" };
    if (!author.name && author) author.name = "";
    if (!author.url && author) author.url = "";
    return `
        <link type="application/json+oembed" href="https://www.embedl.ink/api/oembed?provider_name=What%20is%20this%3F&provider_url=https://tencuter.com/&author_name=${author.name}&author_url=${author.url}">
        <meta property="og:title" content="${title}">
        <meta name="twitter:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta name="twitter:description" content="${description}">
        <meta name="description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta name="twitter:image" content="${image}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="theme-color" content="${color}">
    `
};

module.exports = createEmbed;