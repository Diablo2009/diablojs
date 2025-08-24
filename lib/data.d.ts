/** 
 * Writes data to data.json if the file is not locked.
 * If the file is locked, it will log a message noting that and wait for the file to unlock.
 * The name passed to the function will be split into parts based on periods ('.'). 
 */
export declare function writeEntry(name: string, data: any): void;
/**
 * Gets the data of an entry.
 * Does not need to lock the json file, thus not caring about whether it is locked.
 */
export declare function getEntry(name: string): any;