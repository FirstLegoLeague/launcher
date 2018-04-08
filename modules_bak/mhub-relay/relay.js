/**
 * Relay between two or more MHub servers.
 */
"use strict";
var mhub_1 = require("mhub");
var util_1 = require("./util");
var config_1 = require("./config");
var Connection = (function () {
    function Connection(relay, name) {
        var _this = this;
        this.bindings = Object.create(null);
        this._reconnectTimer = null;
        this._connecting = null;
        this.relay = relay;
        this.name = name;
        // TODO: move this step to config parsing
        var config = relay.config;
        for (var id in config.bindings) {
            if (!config.bindings.hasOwnProperty(id)) {
                continue;
            }
            var binding = config.bindings[id];
            var input = binding.input.filter(function (f) { return f.node.server === _this.name; });
            if (input.length === 0) {
                continue;
            }
            this.bindings[id] = {
                input: input,
                output: binding.output,
                transform: binding.transform
            };
        }
    }
    Connection.prototype._log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        args.unshift("[" + this.name + "]");
        console.log.apply(null, args);
    };
    Connection.prototype._connect = function () {
        var _this = this;
        if (this._connecting) {
            return;
        }
        var config = this.relay.config;
        var c = new mhub_1.MClient(config.connections[this.name]);
        this._connecting = c;
        this._log("connecting to " + config.connections[this.name]);
        c.on("open", function () {
            _this._log("connected");
            _this.client = c;
            _this._connecting = null; // TODO maybe wait until subscribe is done
            _this._subscribe();
        });
        c.on("close", function () {
            _this._log("closed");
            _this._reconnect();
        });
        c.on("error", function (e) {
            _this._log("error:", e);
            _this._reconnect();
        });
        c.on("message", function (m, subscription) {
            _this._handleMessage(m, subscription);
        });
    };
    Connection.prototype._reconnect = function () {
        var _this = this;
        if (this._connecting) {
            this._connecting.close();
            this._connecting = null;
        }
        if (this.client) {
            this.client.close();
            this.client = null;
        }
        if (!this._reconnectTimer) {
            this._reconnectTimer = setTimeout(function () {
                _this._reconnectTimer = null;
                _this._connect();
            }, 3000);
        }
    };
    Connection.prototype._handleMessage = function (message, subscription) {
        var _this = this;
        /* TODO: think this through some more: relay can also be used to process
           messages that come back again on e.g. different nodes, which would
           not necessarily be loops.
           Additionally, need to actually set this header on outgoing messages.
        if (message.headers["x-via-" + currentInstance]) {
            return; // Skip the messages we posted ourselves
        }
        */
        if (!this.client) {
            return;
        }
        var binding = this.bindings[subscription];
        if (!binding) {
            return;
        }
        console.log("#" + subscription + " [" + this.name + "] " + message.topic);
        if (!binding.transform) {
            this._publish(message, binding);
        }
        else {
            Promise.resolve(message)
                .then(binding.transform)
                .then(function (transformed) {
                if (transformed === undefined) {
                    return;
                }
                util_1.ensureArray(transformed).forEach(function (msg) {
                    if (typeof msg !== "object") {
                        throw new Error("invalid transformed message: object or array of objects expected");
                    }
                    if (typeof msg.topic !== "string") {
                        throw new Error("invalid transformed message: topic string expected");
                    }
                    _this._publish(msg, binding);
                });
            }).catch(function (e) {
                setImmediate(function () { throw new Error("message transform failed: " + String(e)); });
            });
        }
    };
    Connection.prototype._publish = function (message, binding) {
        var _this = this;
        binding.output.forEach(function (out) {
            var outConn = _this.relay.connections[out.server];
            // TODO prefix every line with a unique message ID?
            // Because transformed message may be out-of-order/delayed etc
            console.log(" -> [" + out.server + "/" + out.node + "]: " + message.topic);
            if (outConn.client) {
                outConn.client.publish(out.node, message);
            }
            else {
                console.warn("  -> error: " + out.server + ": not connected");
            }
        });
    };
    Connection.prototype._subscribe = function () {
        var _this = this;
        for (var id in this.bindings) {
            this.bindings[id].input.forEach(function (i) {
                _this.client.subscribe(i.node.node, i.pattern, id);
            });
        }
    };
    Connection.prototype.start = function () {
        this._connect();
    };
    return Connection;
})();
exports.Connection = Connection;
var Relay = (function () {
    /**
     * Instantiate new MHub Relay object
     *
     * @param  {ConfigRoot} configJson Relay configuration object
     * @param  {string}     rootDir    Root directory to resolve relative (transform-)filenames.
     *                                 Uses working dir if left empty.
     *                                 Tip: use `__dirname` from your own scripts.
     */
    function Relay(configJson, rootDir) {
        var _this = this;
        this.connections = {};
        this.config = config_1.parseConfig(configJson, rootDir);
        // Create connection objects (also validates config semantically)
        Object.keys(this.config.connections).forEach(function (name) {
            _this.connections[name] = new Connection(_this, name);
        });
    }
    Relay.prototype.start = function () {
        var _this = this;
        // Start the connections
        Object.keys(this.connections).forEach(function (name) {
            _this.connections[name].start();
        });
    };
    return Relay;
})();
exports.Relay = Relay;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Relay;
//# sourceMappingURL=relay.js.map