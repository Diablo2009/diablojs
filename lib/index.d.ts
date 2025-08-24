/** The data directory where DiabloJS is stored. */
export declare const DJS_DATA: string;
/** The list of module directories, excluding the built-in modules. */
export declare const DJS_MODULES: string[];
/**
 * Gets the config file from DJS_DATA/config.json
 */
export declare function getDJSConfig(): any;