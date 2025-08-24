// Stability 1 - Unstable
//
// DiabloJS works with a basic json file standard, 
// using a file in the DJS_DATA directory ($HOME/.djs on linux; %LocalAppData%\\DiabloJS on Windows).
// Providing access to the config and data directories is important since everything else relies on those directories.

/** The apis used by DiabloJS's init functions */
const node_api = {
    path: require("node:path"),
    vm: require("node:vm"),
    fs: require("node:fs"),
    assert: require("node:assert")
};

const DJS_DATA = process.platform == "win32" ? node_api.path.join(process.env.LocalAppData, "DiabloJS") : node_api.path.join(process.env.HOME, ".djs");
let DJS_MODULES;

// Check for existing config
if (!node_api.fs.existsSync(node_api.path.join(DJS_DATA, "config.json")) || !node_api.fs.existsSync(node_api.path.join(DJS_DATA, "data.json")))
{
    const default_config = {
        module_dirs: [],
        allowExtensions: false
    };

    node_api.fs.mkdirSync(DJS_DATA, { recursive: true });
    node_api.fs.writeFileSync(node_api.path.join(DJS_DATA, "config.json"), JSON.stringify(default_config, null, 2), "utf-8");
    node_api.fs.writeFileSync(node_api.path.join(DJS_DATA, "data.json"), JSON.stringify({}, null, 2), "utf-8");
}

// Grabs the config from DJS_DATA/config.json
function getDJSConfig() {
    const config_file = node_api.path.join(DJS_DATA, "config.json");

    if (!node_api.fs.existsSync(config_file))
        return {};

    const str = node_api.fs.readFileSync(config_file, "utf-8");

    return JSON.parse(str);
}

DJS_MODULES = [
    ...(() => {
        const config = getDJSConfig();

        return config["module_dirs"] || [];
    })()
];

module.exports = {
    DJS_DATA,
    DJS_MODULES,
    getDJSConfig
};