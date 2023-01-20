const fetch = require('node-fetch');
require('dotenv').config();

async function shortenURL(url) {
    const res = await fetch(`${process.env.DOMAIN_NAME}/api/shorten/${encodeURIComponent(url)}?apiKey=${process.env.KVDB_KEY}`);
    if (res.status !== 200) return null;
    return await res.text();
};

module.exports = shortenURL;