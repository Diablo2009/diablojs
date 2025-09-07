// DJS Init | Errors

class Error extends __DJS_ERROR
{
    name = "Error";
}

class EvalError extends Error
{
    name = "EvalError";
}

class TypeError extends Error
{
    name = "TypeError";
}

class RangeError extends Error
{
    name = "RangeError";
}

class SyntaxError extends Error
{
    name = "SyntaxError";
}

class AggregateError extends Error
{
    name = "AggregateError";
}

class ReferenceError extends Error
{
    name = "ReferenceError";
}

__DJS_OBJECT.assign(globalThis, { Error, EvalError, TypeError, RangeError, SyntaxError, AggregateError, ReferenceError }); // Assign to context using the __DJS_OBJECT class (since Object doesn't exist yet.)