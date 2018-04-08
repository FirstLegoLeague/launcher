import { MClient } from "mhub";
import { ConfigRoot, RelayConfig, Binding } from "./config";
export declare class Connection {
    relay: Relay;
    client: MClient;
    name: string;
    bindings: {
        [id: string]: Binding;
    };
    private _reconnectTimer;
    private _connecting;
    constructor(relay: Relay, name: string);
    private _log(...args);
    private _connect();
    private _reconnect();
    private _handleMessage(message, subscription);
    private _publish(message, binding);
    private _subscribe();
    start(): void;
}
export declare class Relay {
    config: RelayConfig;
    connections: {
        [name: string]: Connection;
    };
    /**
     * Instantiate new MHub Relay object
     *
     * @param  {ConfigRoot} configJson Relay configuration object
     * @param  {string}     rootDir    Root directory to resolve relative (transform-)filenames.
     *                                 Uses working dir if left empty.
     *                                 Tip: use `__dirname` from your own scripts.
     */
    constructor(configJson: ConfigRoot, rootDir?: string);
    start(): void;
}
export default Relay;
