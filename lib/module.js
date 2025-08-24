// Stability: 1 - Unstable

// DiabloJS uses a custom staging system for modules (stage1, stage2, etc...).
// By this point, the DiabloJS VM is active and all module files will be execute under the vm.Engine class. (See lib/vm.js)

const { DJS_MODULES } = require("./index");
const node_fs = require("node:fs");
const node_path = require("node:path");

const ModuleManagerSpaces = [];

// ModuleManager is the management class of a module.
// Although it is technically public, the raw instance of it is never published, 
// only constructed instances.
class ModuleManager {
    constructor(id, files, moduleId) {
        if (typeof id != "number")
            throw new TypeError("'id' is not of type number.");
        else if (typeof moduleId != "string")
            throw new TypeError("'moduleId' is not of type string.");
        else if (!Array.isArray(files))
            throw new TypeError("'files' is not of type array.");

        if (ModuleManagerSpaces[id] != undefined)
            throw new EvalError(`ModuleManager id ${id} already exists!`);

        if (id != -1 && !DJS_MODULES[id])
            throw new EvalError(`Could not get module path at id ${id}`);

        const path = id == -1 ? node_path.join(__dirname, "..", "djs_modules") : DJS_MODULES[id];

        ModuleManagerSpaces[id] = {
            files,
            path
        };

        this.getFilesArray = function getFilesArray() {
            return ModuleManagerSpaces[id].files;
        }

        this.getModulePath = function getModulePath() {
            return ModuleManagerSpaces[id].path;
        }

        this.getModuleId = function getModuleId() {
            return moduleId;
        }
    }

    getFilesArray;
    getModulePath;
    getModuleId;
}

// Stage files should be in the format stage(number).djs
// If a file is not in the format, we should notify the module loader.
function isStageFile(fileName) {
    if (typeof fileName != "string")
        return false;

    if (!fileName.startsWith("stage"))
        return false;

    const stageName = fileName.substring("stage".length);

    if (node_path.extname(fileName) != ".djs")
        return false;

    const stageNumber = Number(node_path.basename(stageName, "djs"));

    if (isNaN(stageNumber))
        return false;

    if (stageNumber < 0)
        return false;

    return true;
}

// Attempts to load a module by its array id (see DJS_MODULES).
// If a module doesn't contain any files, it will return an empty ModuleManager class.
function loadModule(id) {
    if (typeof id != "number")
        throw new TypeError("'id' is not of type number.");
    else if (id != -1 && !DJS_MODULES[id])
        throw new EvalError(`Could not get module path at id ${id}`);

    const modpath = id == -1 ? node_path.join(__dirname, "..", "djs_modules") : DJS_MODULES[id];

    const modlStat = node_fs.lstatSync(modpath);

    if (!modlStat.isDirectory())
        throw new EvalError(`The path of module ${id} is not a directory (path = ${modpath})`);

    const modDirList = node_fs.readdirSync(modpath, { encoding: "utf-8", recursive: false, withFileTypes: true });

    let modId;
    const stages = [];

    for (let i = 0; i < modDirList.length; i++)
    {
        const stage = modDirList[i];

        if (!isStageFile(stage.name))
        {
            if (stage.name == "id.txt")
                modId = node_fs.readFileSync(node_path.join(stage.parentPath, stage.name), "utf-8");
            continue;
        }

        stages.push(stage.name);
    }

    if (!modId)
        throw new Error("No module id found! (Does an id.txt file exist?)")

    const sortedArray = stages.sort((stA, stB) => {
        const len = "stage".length;
        stA = node_path.basename(stA, "djs");
        stB = node_path.basename(stB, "djs");

        const A = stA.substring(len);
        const B = stB.substring(len);

        return Number(A) - Number(B);
    });

    const moduleManager = new ModuleManager(id, sortedArray, modId);

    return moduleManager;
}

module.exports = {
    loadModule
}