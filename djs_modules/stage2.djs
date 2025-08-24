// Stage 2 - Creation of the DJS object

const DJS = {};

(function (djs) {
    const JSON = __DJS_JSON;
    const require = __DJS_REQUIRE;
    const console = require("node:console");
    const fs = require("node:fs");
    const path = require("node:path");
    const utils = require("node:util");

    djs.log = function djsLog(message, ...optionalParameters) {
        console.log(message, ...optionalParameters);
    }

    djs.version = function djsVersion() {
        const packageJson = path.join(__DJS_ROOT_DIR, "package.json");

        const str = fs.readFileSync(packageJson, "utf-8");

        const json = JSON.parse(str);

        return json["version"];
    }

    djs.cwd = function djsCwd() {
        return path.resolve("./");
    }

    class UserModules extends Map {
        set(key, value) {
            if (typeof key != "string")
                throw new TypeError("'key' is not of type string.");
            else if (typeof value != "object")
                throw new TypeError("'value' is not of type object.");

            super.set(key, value);
        }

        [utils.inspect.custom]() {
            return `${UserModules.name}(${this.size})`
        }
    }

    djs.userModules = new UserModules();

    djs.ROOT_PATH = __DJS_ROOT_DIR;
})(DJS);

globalThis.DJS = DJS;