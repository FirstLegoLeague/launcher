"use strict";

import { Message } from "mhub";
import * as path from "path";

import { MaybeArray, ensureArray } from "./util";

/**
 * Structure of a relay.conf.json file.
 */
export interface ConfigRoot {
	/**
	 * Map of identifier => URL, e.g. { "myserver": "ws://localhost:13900" }
	 */
	connections: { [ name: string ]: string; };

	/**
	 * Bindings between endpoints (i.e. input/output pairs).
	 * Every binding has a unique name.
	 */
	bindings: { [name: string ]: BindingConfig; };
}

/**
 * Binding between input and output node(s), optionally with a transform
 * function.
 */
export interface BindingConfig {
	input: MaybeArray<string|InputConfig>;
	output: string|string[];
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

export type Connections = { [ name: string ]: string; };
export type Bindings = { [name: string ]: Binding; };

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
};

/**
 * Input specification for a binding, i.e. which node(s) to subscribe to, using
 * which pattern(s).
 */
export interface Input {
	node: NodeSpec;
	pattern?: string;
}

export type Transform = (message: Message) => void|Message|Message[]|Promise<void|Message|Message[]>;

export interface Binding {
	input: Input[];
	output: NodeSpec[];
	transform?: Transform;
}

function parseNodeSpec(s: string|NodeSpec): NodeSpec {
	if (typeof s !== "string") {
		return s;
	}
	let match = (<string>s).match(/([^\/]+)\/(.*)/);
	if (!match) {
		throw new Error(`invalid NodeSpec '${s}', expected e.g. 'server/node'`);
	}
	return {
		server: match[1],
		node: match[2]
	};
}

/**
 * Parse and validate 'raw' configuration object.
 *
 * @param  {ConfigRoot}  config  Raw configuration object (as given in e.g. config file)
 * @param  {string}      rootDir Optional base path for resolving relative filenames (e.g. for transforms)
 * @return {RelayConfig}         Parsed configuration
 */
export function parseConfig(config: ConfigRoot, rootDir?: string): RelayConfig {
	if (!rootDir) {
		// Use working dir as root dir if it wasn't explicitly given
		rootDir = "";
	}

	// Parse connection settings
	if (typeof config.connections !== "object") {
		throw new Error("invalid configuration: missing 'connections' object");
	}
	let connections: Connections = config.connections;

	// Parse bindings
	let bindings: Bindings = {};
	if (typeof config.bindings !== "object") {
		throw new Error("invalid configuration: missing 'bindings' object");
	}
	for (let id in config.bindings) {
		if (!config.bindings.hasOwnProperty(id)) {
			continue;
		}
		let bindConf = config.bindings[id];

		let input: Input[] = ensureArray(bindConf.input).map((i: string|InputConfig): Input => {
			if (typeof i === "string") {
				return {
					node: parseNodeSpec(i)
				}
			} else {
				return {
					node: parseNodeSpec(i.node),
					pattern: i.pattern
				}
			}
		});

		let output: NodeSpec[] = ensureArray(bindConf.output).map(parseNodeSpec);

		let transform: Transform;
		if (bindConf.transform) {
			try {
				let t: any = bindConf.transform;
				if (typeof t === "string") {
					// Resolve any filename relative to the rootDir (unless it's
					// already given as absolute name)
					const filename: string = bindConf.transform;
					t = require(path.resolve(rootDir, filename));
				}
				if (typeof t === "object" && t.default) {
					t = t.default;
				}
				if (typeof t !== "function") {
					throw new Error("transform must (default) export a single function");
				}
				transform = t;
			} catch (e) {
				throw new Error(`error loading transform '${bindConf.transform}': ${e}`);
			}
		}

		bindings[id] = {
			input,
			output,
			transform
		};
	}

	return {
		connections,
		bindings
	}
}
