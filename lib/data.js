// Stability 2 - Partially Stable
//
// DiabloJS data handling is handle through the json file DJS_DATA/data.json,
// which means that different parts of the DiabloJS package can access the data.
// Though the problem of implementing the handling needs to be taken care of.

const { DJS_DATA } = require("./index");
const node_path = require("node:path");
const node_fs = require("node:fs");

const DATA_CONFIG = node_path.join(DJS_DATA, "data.json");
const LOCK_FILE = node_path.join(DJS_DATA, "data.json.lock");

// Checks if the data.json file is locked. 
// If execution of the program ends early, the lock file will need to be cleared by the user.
function isLocked() {
    return node_fs.existsSync(LOCK_FILE);
}

// Toggles the lock on the data.json file.
// The unlocker will need to have the specific id that is provided when locked.
// Conditions:
//  - If a -1 (default value) is passed to the function, 
// the return value will either be a random positive number or -1, depending on the lock state.
//  - If any positive number is passed, it will either unlock the file if it is the correct lock id and return a 0 or return a -1.
function lock(id = -1) {
    if (id == -1)
    {
        if (isLocked())
            return -1;

        const randomId = Math.round(Math.random() * (10000 - 0) + 0);

        node_fs.writeFileSync(LOCK_FILE, randomId.toString(10), "utf-8");

        return randomId;
    } else {
        if (!isLocked())
            return -1;

        const actualId = node_fs.readFileSync(LOCK_FILE, "utf-8");

        if (Number(actualId) != id)
            return -1;

        node_fs.rmSync(LOCK_FILE, { recursive: true, force: true });

        return 0;
    }
}

function getFullEntryName(name) {
    if (typeof name != "string")
        throw new TypeError("'name' is not of type string.");

    const parts = [];
    const nameParts = name.split("");

    while (nameParts.length > 0)
    {
        if (nameParts[0] == "\"" || nameParts[0] == "'")
        {
            const initialCharacter = nameParts.shift();

            let str = "";

            while (nameParts.length > 0 && nameParts[0] != initialCharacter)
                str += nameParts.shift();

            nameParts.shift();

            parts.push(str);
        } else if (nameParts[0].toUpperCase() != nameParts[0].toLowerCase()) {
            let name = "";
            while (nameParts.length > 0 && nameParts[0].toUpperCase() != nameParts[0].toLowerCase())
                name += nameParts.shift();

            parts.push(name);
        } else
            nameParts.shift();
    }

    return parts;
}

// Gets the data of an entry.
// If the entry does not get, returns undefined.
function getEntry(name) {
    if (typeof name != "string")
        throw new TypeError("'name' is not of type string.");

    const parts = getFullEntryName(name);

    const data_string = node_fs.readFileSync(DATA_CONFIG, "utf-8");

    const data = JSON.parse(data_string);

    let item;

    for (let i = 0; i < parts.length; i++)
    {
        item = data[parts[i]];
    }

    return item;
}

// Writes data to data.json if the file is not locked.
// If the file is locked, it will log a message noting that and wait for the file to unlock.
// The name passed to the function will be split into parts based on periods ('.').
function writeEntry(name, data) {
    if (typeof name != "string")
        throw new TypeError("'name' is not of type string.");
    
    const parts = getFullEntryName(name);
    const data_string = node_fs.readFileSync(DATA_CONFIG, "utf-8");

    const currentData = JSON.parse(data_string);

    if (JSON.stringify(getEntry(name)) === JSON.stringify(data)) 
        return;

    let id = lock(-1);
    // If the file is already locked, wait for it to unlock.
    while (id == -1) {
        console.log("[DATA] File is Locked");
        id = lock(-1);
    }

    let item = currentData;

    for (let i = 0; i < parts.length - 1; i++) {
        if (!item[parts[i]]) {
            item[parts[i]] = {};
        }
        item = item[parts[i]];
    }

    item[parts[parts.length - 1]] = data;

    node_fs.writeFileSync(DATA_CONFIG, JSON.stringify(currentData, null, 2));

    lock(id);
}

module.exports = {
    writeEntry,
    getEntry
}