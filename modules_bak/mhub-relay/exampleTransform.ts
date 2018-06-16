"use strict";

import { Message } from "mhub";

function delay(ms: number): Promise<void> {
	return new Promise<void>((resolve) => {
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
export default function(msg: Message): void|Message|Message[]|Promise<Message> {
	if (msg.topic === "pass") {
		// Simply pass the message (like a filter)
		return msg;
	} else if (msg.topic === "delay") {
		// Emit the same message after one second
		return delay(1000).then(() => msg);
	} else if (msg.topic === "duplicate") {
		// Emit the same message twice immediately
		return [msg, msg];
	} else if (msg.topic === "change") {
		// Return a modified message.
		// Note: never modify the original message, create a new one instead.
		let modified = msg.clone();
		modified.topic = "changed";
		return modified;
	}
	// In all other cases, nothing is returned, basically discarding the
	// received message.
}
