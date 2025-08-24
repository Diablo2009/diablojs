// Stage 1 - Create Base Classes

// This is the same class as in NodeJS (see lib/vm.js - Engine class constructor),
// it only extends it to hide all the references.
class Error extends __DJS_ERROR {
    name = "Error";
}

class TypeError extends Error {
    name = "TypeError";
}

class RangeError extends Error {
    name = "RangeError";
}

class EvalError extends Error {
    name = "EvalError";
}

class AcquireError extends Error {
    name = "AcquireError";
}

class Map extends __DJS_MAP {

}

globalThis.Error = Error;
globalThis.TypeError = TypeError;
globalThis.RangeError = RangeError;
globalThis.EvalError = EvalError;
globalThis.AcquireError = AcquireError;
globalThis.Map = Map;