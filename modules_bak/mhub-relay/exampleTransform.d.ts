import { Message } from "mhub";
/**
 * Example transform to demonstrate various possible actions
 * to take on a message.
 *
 * @param msg Message just received on this binding.
 * @return Message(s), promise for message(s), or void
 */
export default function (msg: Message): void | Message | Message[] | Promise<Message>;
