// Stage 3 - Require

// Checks if a module name is valid. If it is, then return true. Otherwise false.
function isValidModule(moduleName) {
    if (typeof moduleName != "string")
        return false;

    // Only applies for DJS modules.
    const validPrefixs = [
        "djs",
        "node", // Imports a node file into the DJS context (This cannot import packages!)
        "internal" // For internal features such as NodeJS modules (ex: node:fs, node:path)
    ];

    for (let i = 0; i < validPrefixs.length; i++)
    {
        if (moduleName.startsWith(validPrefixs[i]) && !moduleName.startsWith("internal"))
            return true;
        else if (moduleName.startsWith("internal"))
        {
            // Additional checking for internal modules.
            if (!moduleName.startsWith("internal@"))
                return false;

            const intModuleName = moduleName.substring(
                "internal@".length
            );

            const validIntPrefixs = [
                "node",
                "dfs" // Same as just dfs:*, but with the ability to get some of the other internal modules.
            ];

            for (const prefix of validPrefixs) {
                if (intModuleName == prefix)
                    return true;
            }

            return false;
        }
        else {
            return DJS.userModules.has(moduleName);
        }
    }

    return false;
}

function grabDjsFile(filePath) {
    throw "Cannot get djs at this time!";
}

// Require is a bit advanced as we have a custom loading system in DiabloJS.
// The step process is:
// - Check if Module
// - Load Module 
// - Load File
function require(id) {
    // Checks

    if (typeof id != "string")
        throw new TypeError("'id' is not of type string.");

    // Modules are defined by a module name cut by a ':' before the section name.
    // Ex: 'djs:base'. So we need to split and do checks on this as well.
    const parts = id.split(":");

    if (parts.length > 2)
        throw new EvalError("The usage of ':' in require is limited to one use at max.");

    const moduleName = parts[0];
    const sectionName = parts[1];

    if (!sectionName) { // If we are just a plain file.
        const name = id;

        const path = __DJS_REQUIRE("node:path");
        const fs = __DJS_REQUIRE("node:fs");

        // TODO: Finish non-module loading with support for importing using the exports id.
    }

    if (!isValidModule(moduleName))
        throw new AcquireError(`Could not get ${id}.`);

    if (moduleName == "internal@node")
    {
        return __DJS_REQUIRE(`node:${sectionName}`);
    }
    else if (moduleName == "internal@dfs" || moduleName == "dfs")
    {
        const path = __DJS_REQUIRE("node:path");
        const modulePath = path.join(__DJS_ROOT_DIR, "djs_modules");

        if (sectionName.startsWith("stage"))
            throw new AcquireError(`Cannot grab the initial staging modules from the dfs module namespace!`);
        
        return grabDjsFile(path.join(modulePath, sectionName + ".djs"));
    }
    else if (moduleName == "node")
    {
        const path = __DJS_REQUIRE("node:path");

        if (!path.isAbsolute(sectionName))
            sectionName = path.join("./", sectionName);

        return __DJS_REQUIRE(sectionName);
    }
    else {
        // User Modules are defined by an object with the section names and the type of djs, js, or object.

        const mod = DJS.userModules.get(moduleName);

        if (!mod[sectionName])
            throw new AcquireError(`Could not get ${id}.`);

        const section = mod[sectionName];

        if (
            !section["type"] 
            || (
                section["type"] != "djs" 
                && section["type"] != "js" 
                && section["type"] != "object"
            )
        )
            throw new EvalError("Invalid UModule Section!");
        else if (
            !section["value"]
            || (typeof section["value"] != "object"
            && typeof section["value"] != "string")
        )
            throw new EvalError("Invalid UModule Section!");

        /** @type {"djs" | "js" | "object"} */
        const type = section["type"];
        /** @type {string | object} */
        const value = section["value"];

        if (type == "object")
            return value;
        else if (type == "js")
        {
            return __DJS_REQUIRE(value);
        }
        else
            return grabDjsFile(value);
    }
}

globalThis.require = require;