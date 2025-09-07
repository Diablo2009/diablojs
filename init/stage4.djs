// DJS Init | Require

function require(id)
{
    if (typeof id != "string")
    {
        throw new TypeError(`Expected type string for id, got: ${typeof id}`);
    }

    const [name, module] = id.split("@");

    if (module && name != "node")
    {
        return require.module(name, module);
    }
    
    return require.resolve(name);
}

require.module = function requireModule(name, module)
{
    if (typeof name != "string")
    {
        throw new TypeError(`Expected type string for name, got: ${typeof id}`);
    }
    else if (typeof module != "string")
    {
        throw new TypeError(`Expected type string for module, got: ${typeof id}`);
    }

    const libfiles = __NODE_REQUIRE("libdjs").getDJSFiles();
    const path = __NODE_REQUIRE("node:path");

    if (name == "djs")
    {
        let mPath = null;

        for (const file of libfiles)
        {
            if (path.basename(file, "djs") === module)
            {
                mPath = file;
                break;
            }
        }

        return require.resolve(mPath);
    }
    else if (name == "node")
    {
        return __NODE_REQUIRE("node:" + module);
    }
    else {
        throw ReferenceError("Unknown Module Section: " + name);
    }
}

require.resolve = function requireResolve(path)
{
    if (path == "node")
    {
        throw ReferenceError("Unknown Module Section: node.");
    }

    const fs = require.module("node", "fs");

    if (!fs.existsSync(path))
    {
        throw new EvalError("Could not find the specifed module.");
    }

    const str = fs.readFileSync(path);

    const res = __NODE_REQUIRE("diablojs").run_js(str);

    return res;
}

Object.assign(globalThis, { require });