export interface ChromeEvent {
    name: string;
    ph?: string;
    cat?: string;
    ts?: number;
    pid?: number | string;
    tid?: number | string;
    id?: number | string;
    args?: {
        [key: string]: any;
    };
    id2?: {
        local?: string;
        global?: string;
    };
}
export declare class JavaScriptTracer {
    static startTime: number;
    static events: ChromeEvent[];
    static layer: string;
    static output: string;
    static session: import("node:inspector").Session;
    static counter: number;
    static initJavaScriptTrace(layer: string, output: string): Promise<void>;
    static initCpuProfiler(): void;
    /**
     *
     * @param isEnd true means we are at the end of tracing,and can append ']' to close the json
     * @returns
     */
    static cleanupJavaScriptTrace(): Promise<void>;
    static getTs(): number;
    static getCommonEv(): {
        tid: number;
        pid: number;
        ts: number;
        cat: string;
    };
    static pushEvent(event: ChromeEvent): void;
    static startAsync(events: ChromeEvent): void;
    static endAsync(events: ChromeEvent): void;
}
