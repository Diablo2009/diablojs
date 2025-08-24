const engine = require("app:engine");
const runtime = require("app:runtime");

if (engine.args.length < 1)
{
    DJS.log("Usage: djs <file_name>");
    require("internal@node:process").exit(0);
}

if (!engine.runCode(runtime.getFile(engine.args[0])))
{
    DJS.log("Usage: djs <file_name>");
    require("internal@node:process").exit(1);
};