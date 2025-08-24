// Stability: 1 - Unstable
//
// DiabloJS exports a custom api class that allows for easier management of both the vm context and the vm itself.
// The vm will by default contain a base engine class, meant for just managing the original module.

const mod = require("./module");
const node_path = require("node:path");
const node_fs = require("node:fs");
const node_vm = require("node:vm");

const EngineSpaces = [];
let NoGlobal = false;

// The engine class provides abstractions from the base node:vm module, 
// while also providing context management.
class Engine {
    /**
     * 
     * @param {import("./module").ModuleManager | Engine} moduleManagerOrEngine
     */
    constructor(moduleManagerOrEngine, isGlobal = false) {
        const randId = Math.round(Math.random() * (100 - 0) + 0);
        this.id = randId;

        if (typeof moduleManagerOrEngine == "undefined") {
            this.getContext = function getContext() {
                const currentContext = EngineSpaces[this.id].context;
                return {...currentContext};
            }
        }
        // Engine dealings
        else if (moduleManagerOrEngine instanceof Engine) {
            const engine = moduleManagerOrEngine;

            this.getContext = function getContext() {
                const baseEngineId = engine.id;

                const baseEngineContext = EngineSpaces[baseEngineId].context;
                const currentContext = EngineSpaces[this.id].context;

                return {
                    ...currentContext,
                    ...baseEngineContext
                };
            }
        } else {
            const moduleManager = moduleManagerOrEngine;

            const modpath = moduleManager.getModulePath();
            const modfiles = moduleManager.getFilesArray();
            let modcontext;
            if (moduleManager.getModuleId() == "djs:internal")
                modcontext = {
                    __DJS_ERROR: class __DJS_ERROR extends Error {},
                    __DJS_MAP: class __DJS_MAP extends Map {},
                    __DJS_REQUIRE: id => require(id),
                    __DJS_ROOT_DIR: node_path.join(__dirname, ".."),
                    __DJS_JSON: JSON
                }
            else
                modcontext = {};

            for (let i = 0; i < modfiles.length; i++)
            {
                const filepath = node_path.join(modpath, modfiles[i]);

                if (!node_fs.existsSync(filepath))
                    throw new Error("Cannot find a file located within a ModuleManager");

                const filestr = node_fs.readFileSync(filepath, "utf-8");

                if (!node_vm.isContext(modcontext))
                    node_vm.createContext(modcontext);

                node_vm.runInContext(filestr, modcontext, moduleManager.getModuleId());
            }

            if (moduleManager.getModuleId() == "djs:internal")
            {
                const finalContext = {
                    Error: modcontext.Error,
                    TypeError: modcontext.TypeError,
                    RangeError: modcontext.RangeError,
                    EvalError: modcontext.EvalError,
                    AcquireError: modcontext.AcquireError,
                    Map: modcontext.Map,
                    DJS: modcontext.DJS,
                    require: modcontext.require
                };

                EngineSpaces[this.id] = {
                    context: finalContext
                };
            }

            this.getContext = function getContext() {
                const currentContext = EngineSpaces[this.id].context;
                return {...currentContext};
            }
        }

        this.addToContext = function addToContext(name, value) {
            if (typeof name != "string")
                throw new TypeError("'name' is not of type string.");

            const originalContext = EngineSpaces[this.id].context;

            originalContext[name] = value;

            EngineSpaces[this.id].context = originalContext;
        }

        this.runCode = function runCode(code, name) {
            if (typeof code != "string")
                throw new TypeError("'code' is not of type string.");
            else if (typeof name != "string")
                throw new TypeError("'name' is not of type string.");

            const context = {
                ...this.getContext(),
                exports: {}
            };

            if (!node_vm.isContext(context))
                node_vm.createContext(context);

            node_vm.runInContext(code, context, name);

            if (!isGlobal || NoGlobal)
            {
                const globalContext = EngineSpaces[GlobalEngine.id].context;

                globalContext.DJS.userModules = context.DJS.userModules;

                EngineSpaces[GlobalEngine.id].context = globalContext;
            }

            return context.exports;
        }

        const val = EngineSpaces[this.id];

        EngineSpaces[this.id] = {...(typeof val == "object" && val ? val : {})};
    }

    getContext;
    addToContext;
    runCode;
    id;
}

// The global engine (base engine) that can be used as a base.
// It doesn't have to be used, but it is where all the JS features of DiabloJS are.
const GlobalEngine = new Engine(mod.loadModule(-1), true);

module.exports = {
    Engine,
    GlobalEngine
}