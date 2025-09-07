const fs = require("node:fs");
const path = require("node:path");

module.exports.getDJSInit = function getDJSInit()
{
    const base = path.join(__dirname, "init");

    const dirList = fs.readdirSync(base, { encoding: "utf-8", withFileTypes: true });

    const items = new Array();

    for (const file of dirList) {
        if (!file.isFile())
            continue;

        const extension = path.extname(file.name);

        if (extension != ".djs")
            continue;

        console

        items.push(
            path.join(file.parentPath, file.name)
        );
    }

    return items
        .filter(value => {
            const filename = path.basename(value, ".djs");
            if (!filename.startsWith("stage")) return false;

            const suffix = filename.slice("stage".length);
            return suffix.length > 0 && !isNaN(Number(suffix));
        })
        .sort((a, b) => {
            const aNum = Number(path.basename(a, ".djs").slice("stage".length));
            const bNum = Number(path.basename(b, ".djs").slice("stage".length));
            return aNum - bNum;
        });
}

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

module.exports.R = require;