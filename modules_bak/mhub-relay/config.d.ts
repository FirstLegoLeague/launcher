import { Message } from "mhub";
import { MaybeArray } from "./util";
/**
 * Structure of a relay.conf.json file.
 */
export interface ConfigRoot {
    /**
     * Map of identifier => URL, e.g. { "myserver": "ws://localhost:13900" }
     */
    connections: {
        [name: string]: string;
    };
    /**
     * Bindings between endpoints (i.e. input/output pairs).
     * Every binding has a unique name.
     */
    bindings: {
        [name: string]: BindingConfig;
    };
}
/**
 * Binding between input and output node(s), optionally with a transform
 * function.
 */
export interface BindingConfig {
    input: MaybeArray<string | InputConfig>;
    output: string | string[];
    transform?: string;
}
/**
 * Input specification for a binding, i.e. which node(s) to subscribe to, using
 * which pattern(s).
 */
export interface InputConfig {
    node: string;
    pattern?: string;
}
export declare type Connections = {
    [name: string]: string;
};
export declare type Bindings = {
    [name: string]: Binding;
};
/**
 * Parsed MHub relay config.
 */
export interface RelayConfig {
    /**
     * Map of identifier => URL, e.g. { "myserver": "ws://localhost:13900" }
     */
    connections: Connections;
    /**
     * Bindings between endpoints (i.e. server/node pairs).
     * Every binding has a unique name.
     */
    bindings: Bindings;
}
/**
 * Specification of a node (specified as "server/node" in the config file).
 * Used for `from` and `target` in a Binding.
 */
export interface NodeSpec {
    server: string;
    node: string;
}
/**
 * Input specification for a binding, i.e. which node(s) to subscribe to, using
 * which pattern(s).
 */
export interface Input {
    node: NodeSpec;
    pattern?: string;
}
export declare type Transform = (message: Message) => void | Message | Message[] | Promise<void | Message | Message[]>;
export interface Binding {
    input: Input[];
    output: NodeSpec[];
    transform?: Transform;
}
/**
 * Parse and validate 'raw' configuration object.
 *
 * @param  {ConfigRoot}  config  Raw configuration object (as given in e.g. config file)
 * @param  {string}      rootDir Optional base path for resolving relative filenames (e.g. for transforms)
 * @return {RelayConfig}         Parsed configuration
 */
export declare function parseConfig(config: ConfigRoot, rootDir?: string): RelayConfig;
