#! /usr/bin/env node

const vm = require("../lib/vm");
const path = require("node:path");
const fs = require("node:fs");

const UModuleEngine = new vm.Engine(vm.GlobalEngine);
const AppEngine = new vm.Engine(vm.GlobalEngine);

// Load User Module
(() => {

    const umPath = path.join(__dirname, "umodule.djs");
    const str = fs.readFileSync(umPath, "utf-8");
    const exports = UModuleEngine.runCode(str, "app:init");
})();

(() => {
    const appPath = path.join(__dirname, "app.djs");
    const str = fs.readFileSync(appPath, "utf-8");
    const exports = AppEngine.runCode(str, "app:runtime");
})();