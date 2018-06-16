"use strict";
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
/**
 * Example transform to demonstrate various possible actions
 * to take on a message.
 *
 * @param msg Message just received on this binding.
 * @return Message(s), promise for message(s), or void
 */
function default_1(msg) {
    if (msg.topic === "pass") {
        // Simply pass the message (like a filter)
        return msg;
    }
    else if (msg.topic === "delay") {
        // Emit the same message after one second
        return delay(1000).then(function () { return msg; });
    }
    else if (msg.topic === "duplicate") {
        // Emit the same message twice immediately
        return [msg, msg];
    }
    else if (msg.topic === "change") {
        // Return a modified message.
        // Note: never modify the original message, create a new one instead.
        var modified = msg.clone();
        modified.topic = "changed";
        return modified;
    }
    // In all other cases, nothing is returned, basically discarding the
    // received message.
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=exampleTransform.js.map