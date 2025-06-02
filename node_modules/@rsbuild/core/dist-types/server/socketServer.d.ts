import type { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import type { DevConfig, Rspack } from '../types';
import type { SockWriteType } from './devServer';
interface SocketMessage {
    type: SockWriteType;
    compilationId?: string;
    data?: Record<string, any> | string | boolean;
}
export declare class SocketServer {
    private wsServer;
    private readonly sockets;
    private readonly options;
    private stats;
    private initialChunks;
    private heartbeatTimer;
    constructor(options: DevConfig);
    upgrade: (req: IncomingMessage, sock: Socket, head: any) => void;
    private checkSockets;
    private clearHeartbeatTimer;
    prepare(): Promise<void>;
    updateStats(stats: Rspack.Stats): void;
    sockWrite({ type, compilationId, data }: SocketMessage): void;
    private singleWrite;
    close(): Promise<void>;
    private onConnect;
    private getStats;
    private sendStats;
    private send;
}
export {};
