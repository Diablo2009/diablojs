import { ModuleManager } from "./module";

interface EngineClass {
    getContext(): object;
    addToContext(name: string, value: any): void;
    runCode(code: string, name: string): any;
    id: number;
}

interface Engine {
    new (moduleManager: ModuleManager): EngineClass;
    new (engine: EngineClass): EngineClass;
    new (): EngineClass;
}

export declare const Engine: Engine;
export declare const GlobalEngine: EngineClass;