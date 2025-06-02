import type { DevConfig, ServerConfig } from '../types/config';
/**
 * Checks if localhost resolves differently between node's default DNS lookup
 * and explicit DNS lookup.
 *
 * Returns the resolved address if there's a difference, undefined otherwise.
 * This helps detect cases where IPv4/IPv6 resolution might vary.
 */
export declare function getLocalhostResolvedAddress(): Promise<string | undefined>;
export declare function getResolvedClientConfig(clientConfig: DevConfig['client'], serverConfig: ServerConfig): Promise<DevConfig['client']>;
