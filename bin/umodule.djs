const module = {};

const vm = require("internal@node:vm");
const path = require("internal@node:path");
const fs = require("internal@node:fs");

(function (mod) {
    mod.getFile = function getFile(filePath) {
        if (fs.existsSync(filePath))
            return fs.readFileSync(filePath, "utf-8");
        else
            return null;
    }
})(module);

DJS.userModules.set("app", {
    "runtime": {
        "type": "object",
        "value": module
    },
    "engine": {
        "type": "js",
        "value": path.join(DJS.ROOT_PATH, "bin", "engine.js")
    }
});