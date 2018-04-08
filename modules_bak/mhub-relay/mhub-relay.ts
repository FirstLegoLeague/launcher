/**
 * Relay between two or more MHub servers.
 */

"use strict";

import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import Relay from "./relay";

var args = yargs
	.usage("mhub-relay [-c <config_file>]")
	.help("help")
	.alias("h", "help")
	.version(<any>(() => require(path.resolve(__dirname, 'package.json')).version), "version")
	.alias("v", "version")
	.option("c", {
		type: "string",
		alias: "config",
		description: "Filename of config, uses mhub-relay's relay.conf.json by default"
	})
	.strict()
	.argv;

let configFilename: string;
if (!args.config) {
	configFilename = path.resolve(__dirname, "relay.conf.json");
} else {
	configFilename = path.resolve(args.config);
}
console.log("Using config file " + configFilename);

const configJson = JSON.parse(fs.readFileSync(configFilename, "utf8"));

const relay = new Relay(configJson, path.dirname(configFilename));
relay.start();
