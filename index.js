const fs = require("node:fs");
const path = require("node:path");

module.exports.getDJSFiles = function getDJSFiles() {
    const base = path.join(__dirname, "lib");

    const dirList = fs.readdirSync(base, { encoding: "utf-8", withFileTypes: true });

    const items = new Array();

    for (const file of dirList) {
        if (!file.isFile())
            continue;

        const extension = path.extname(file.name);

        if (extension != ".djs")
            continue;

        items.push(
            path.join(file.parentPath, file.name)
        );
    }

    return items;
}