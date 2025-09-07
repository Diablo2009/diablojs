// DJS Init | JSON Init

const JSON = {};
(function (JSON) {

    // Keeps Node's JSON element seperate by not just make the global JSON the same exact object as Node.
    JSON.parse = __NODE_JSON.parse;
    JSON.stringify = __NODE_JSON.stringify;

})(JSON);

Object.assign(globalThis, { JSON });