import type { Server } from 'node:http';
import type { Http2SecureServer } from 'node:http2';
import type Connect from '../../compiled/connect/index.js';
import type { ServerConfig } from '../types';
export declare const createHttpServer: ({ serverConfig, middlewares, }: {
    serverConfig: ServerConfig;
    middlewares: Connect.Server;
}) => Promise<Http2SecureServer | Server>;
