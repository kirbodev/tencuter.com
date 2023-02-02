const redis = require("redis");
const async = require("async-redis");

/**
 * @type {redis.RedisClientType}
 */
let client;
(async () => {
  client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PASSWORD,
  });

  await async.decorate(client);

  await client.connect();
})();

module.exports = client;
