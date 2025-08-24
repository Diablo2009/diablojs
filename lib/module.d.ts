type ModuleManager = {
    getFilesArray(): string[];
    getModulePath(): string;
    getModuleId(): string;
}

export declare function loadModule(id: number): ModuleManager;