const mod = {};
(function (mod) {

    mod.typeof = function (value) {
        const jsType = typeof value;

        if (jsType == "object")
        {
            if (jsType === null)
                return "null";
            else if (Array.isArray(value))
                return "array";
            else
                return jsType;
        }

        return jsType;
    }

})(mod);

/** @type {{name: string, value: any}[]} */
module.exports = [
    {
        name: "typeof",
        value: (value) => mod.typeof
    }
]