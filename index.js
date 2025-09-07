const libdjs = require("libdjs");
const vm = require("node:vm");
const path = require("node:path");
const fs = require("node:fs");
const worker_threads = require("worker_threads");

const djsFiles = libdjs.getDJSFiles();

function init_context() {
    const context = {
        __DJS_MAP: class __DJS_MAP extends Map {},
        __DJS_ERROR: class __DJS_ERROR extends Error {},
        __DJS_ARRAY: class __DJS_ARRAY extends Array {},
        __DJS_NUMBER: class __DJS_NUMBER extends Number {},
        __DJS_BOOLEAN: class __DJS_BOOLEAN extends Boolean {},
        __DJS_STRING: class __DJS_STRING extends String {},
        __DJS_BUFFER: class __DJS_BUFFER extends Buffer {},
        __NODE_JSON: {...JSON},
        __NODE_REQUIRE: function require(id) { return globalThis.require(id); }
    };

    for (const file of djsFiles)
    {
        const str = fs.readFileSync(file, "utf-8");

        if (!vm.isContext(context))
            vm.createContext(context);

        vm.runInContext(str, context, { filename: `libdjs:${path.basename(file, "djs")}` });
    }

    return context;
}

function run_js(code)
{
    if (typeof code != "string")
    {
        return;
    }

    const context = {};

    const iContext = init_context();

    for (const [key, value] of Object.entries(iContext))
    {
        if (key.startsWith("__"))
            continue;

        context[key] = value;
    }

    console.log(iContext);
}

function exit(code = 0)
{
    process.exit((typeof code == "number") ? code : 0);
}

function usage()
{
    const usageTextArray = [
        "Usage: %s [OPTIONS] <file> [FILE_ARGS]",
        "",
        "Options:",
        " --help, -h    =>  Displays this help message."
    ]; // Done for Readability.

    const usageFormatArray = [
        path.basename(process.argv[1]), // App Name
    ]

    const text = usageTextArray.filter(value => typeof value == "string").join("\n"); // Make sure only string values are joined.


    console.log(text, ...usageFormatArray);
}

/** 
 * @param {string[]} args
 * @returns {(() => Promise<number | void>)| string}
 */
function parse_args(args)
{
    let file = null;
    const fileArgs = [];
    let value = async () => {
        usage();
        exit(0);
    };

    while (args.length > 0)
    {
        if (args[0] == "--help" || args[0] == "-h")
        {
            break;
        }
        else
        {
            if (file !== null)
            {
                fileArgs.push(args.shift());
            }
            else
            {
                file = args.shift();
            }
        }
    }

    if (file !== null)
    {
        // Declare File Helper
        value = async () => {
            if (!fs.existsSync(file))
            {
                console.error("ERROR: Could not find file '%s'!", file);
                exit(2);
            }

            const fileString = fs.readFileSync(file, { encoding: "utf-8" });

            run_js(fileString);
        }
    }

    return value;
}

/** @param {string[]} args */
async function main(args)
{
    // Worker Thread Checking
    if (!worker_threads.isMainThread)
    {
        console.error("ERROR: Cannot run djs as a worker.");
        exit(4);
    }

    const value = parse_args([...args]); // Pass args as a new array.

    if (typeof value == "string")
    {
        console.error("ERROR: %s", value);
        exit(1); // We do not know the extent of the error with just a plain string.
        return;
    } else if (!value)
    {
        console.error("ERROR: Args could not be parsed!");
        exit(1);
        return;
    }

    const exitCode = await value(); // Run the Function provided by the args parser.

    exit(exitCode || 0);
}

main(process.argv.slice(2)); // Start The Main Process.