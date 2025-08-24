const vm = require("../lib/vm");
const engine = new vm.Engine(vm.GlobalEngine);

module.exports.runCode = function runCode(code) {
    if (typeof code != "string")
        return false;

    engine.runCode(code, "app:engine:eval");
    return true;
}

module.exports.args = process.argv.slice(2);