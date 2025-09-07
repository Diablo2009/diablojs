// DJS Init | Type Class

class Array extends __DJS_ARRAY {

}

class Number extends __DJS_NUMBER {

}

class Boolean extends __DJS_NUMBER {
    
}

class String extends __DJS_STRING {

}

class Buffer extends __DJS_BUFFER {

}

class Object extends __DJS_OBJECT {

}

Object.assign(globalThis, { Array, Number, Boolean, String, Buffer, Object });