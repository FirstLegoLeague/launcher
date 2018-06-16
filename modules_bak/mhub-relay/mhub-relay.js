/**
 * Relay between two or more MHub servers.
 */
"use strict";
var fs = require("fs");
var path = require("path");
var yargs = require("yargs");
var relay_1 = require("./relay");
var args = yargs
    .usage("mhub-relay [-c <config_file>]")
    .help("help")
    .alias("h", "help")
    .version((function () { return require(path.resolve(__dirname, 'package.json')).version; }), "version")
    .alias("v", "version")
    .option("c", {
    type: "string",
    alias: "config",
    description: "Filename of config, uses mhub-relay's relay.conf.json by default"
})
    .strict()
    .argv;
var configFilename;
if (!args.config) {
    configFilename = path.resolve(__dirname, "relay.conf.json");
}
else {
    configFilename = path.resolve(args.config);
}
console.log("Using config file " + configFilename);
var configJson = JSON.parse(fs.readFileSync(configFilename, "utf8"));
var relay = new relay_1.default(configJson, path.dirname(configFilename));
relay.start();
//# sourceMappingURL=mhub-relay.js.map