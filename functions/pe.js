const fetch = require("isomorphic-fetch");

module.exports.handler = async (event, context, callback) => {
    try {
        const result = await fetch("https://i.ibb.co/5RM3S6T/pe-1.png");
        const buffer = await result.buffer();

        callback(null, {
            statusCode: 200,
            headers: {
                "Content-Type": "image/png",
            },
            body: buffer.toString("base64"),
            isBase64Encoded: true,
        });
    } catch (e) {
        callback(null, {
            statusCode: 500,
            body: `Something went wrong: ${e}`
        })
    }
};