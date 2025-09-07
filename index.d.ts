declare module "libdjs"
{
    /** Only gets djs *lib* files. */
    export function getDJSFiles(): string[];
    export function getDJSInit(): string[];
    export const R: NodeJS.Require;
}