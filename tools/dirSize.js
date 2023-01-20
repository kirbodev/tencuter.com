const fs = require('fs');

async function getDirSize(dir) {
  const stats = await fs.promises.stat(dir);
    if (stats.isFile()) {
        return stats.size;
    } else if (stats.isDirectory()) {
        const files = await fs.promises.readdir(dir);
        let size = 0;
        for (const file of files) {
            size += await getDirSize(dir + '/' + file);
        }
        return size;
    }
};

module.exports = getDirSize;