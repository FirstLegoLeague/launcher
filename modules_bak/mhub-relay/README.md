# MHub relay (message router)

## Introduction

`mhub-relay` can relay message from one or more [MHub](https://github.com/poelstra/mhub) source nodes to one or more
MHub destination nodes, optionally transforming/filtering them.
Source and destination nodes can be on the same, or different MHub servers.

## What does it do?

It:
* connects to all given MHub servers (specified in `connections` in the config file)
* subscribes to topics on specific nodes on these MHub servers (given as one or more `input`(s) in the `bindings` property of your config)
* optionally transforms messages by passing them through a JS function (specified in `transform` in each binding)
* passes any messages that match these patterns to one or more output nodes (`output` in each binding)

It will also automatically reconnect to a server in case a connection fails.

This functionality can be used for many things, e.g.:
* separation of concerns: by providing application-specific nodes on the MHub
  server, these applications don't have to know about other applications. You
  specify these inter-app relations through bindings in a relay.
* data transformation: automatically convert messages from one application into
  a different message for another application. This can be a simple
  transformation like filtering certain messages or e.g. re-arranging some
  properties, but can even be fetching an updated scores list from a REST API
  whenever a 'new scores' messages arrives, and sending a ranking along to other
  apps.
* relaying 'public' messages from a local MHub network to an MHub server on an
  external network.

## Basic installation and usage

```sh
npm install -g mhub-relay
mhub-relay -c <your_config.json>
```

You'll also need one or more [MHub server(s)](https://github.com/poelstra/mhub).

## Example using the default configuration

First, `npm install -g mhub mhub-relay`.

To make the test more interesting, run two MHub servers:
* one on localhost, port 13900 (the default, just start `mserver`)
* run another one on localhost, port 13901 (copy MHub's `server.conf.json`, change port number, `mserver -c <your_copy.json>`).

Now, start MHub relay with the example configuration:
```sh
mhub-relay
```

Then, start an `mclient` to listen for transformed messages (on node 'test'):
```sh
mclient -l -n test
```

And start another one to listen for 'remotely' copied messages:
```sh
mclient -l -h localhost:13901
```

The first client shows the transformed messages (i.e. those matching the
'complex' binding in `relay.conf.json`), the second one shows how all messages
from the default node on port 13900 are 'copied' to the default node on port
13901 (the 'simple' binding).

In another terminal, send some messages that will be transformed, as specified
by the default example configuration:
```
mclient -t duplicate
mclient -t delay
mclient -t foobar
```

You'll see it on the first listening `mclient` as:
```
{ topic: 'duplicate', data: undefined, headers: {} }
{ topic: 'duplicate', data: undefined, headers: {} }
{ topic: 'delay', data: undefined, headers: {} }
```

And on the second listening `mclient` as:
```
{ topic: 'duplicate', data: undefined, headers: {} }
{ topic: 'delay', data: undefined, headers: {} }
{ topic: 'foobar', data: undefined, headers: {} }
```

## Configuration

See `relay.conf.json` for an example configuration, which shows all
possibilities (see also the inline configuration, below).

Create a copy of that file, edit it to your needs, then start the relay as:
```sh
mhub-relay -c <your_config.json>
```

Note: any relative filename for a transform is resolved relative to the location
of your config file.

## Using as a library

It is also possible to include the relay in your own program, for example:

```js
var Relay = require("mhub-relay").Relay;

var relay = new Relay({
	connections: {
		// Specify server(s) to connect to
		local: "ws://localhost:13900",
		remote: "ws://localhost:13901"
	},
	bindings: {
		simple: {
			// Pass everything from input node(s) to output node(s).
			// Format of a node is "<connection>/<node>"
			input: "local/default",
			output: "remote/default"
		},
		complex: {
			// Input nodes can be given as an array. Every entry can be either
			// a string (matches everything in that connection/node), or an
			// object that specifies a node and the pattern to match.
			// To subscribe to multiple patterns on the same node, simply pass
			// more entries with that same node (each with a different pattern).
			input: [
				{ node: "local/default", pattern: "foo:*" }
			],
			// Every message can (optionally) be transformed/filtered.
			//
			// The transform function is passed the incoming message as its
			// argument. This is an instance of an mhub.Message object,
			// containing topic (string, required), data (any, optional) and
			// headers (name/value pairs, optional).
			//
			// The function can return either undefined, a new message, an array
			// of messages, or a Promise for any of these. Each message will
			// then be sent to the output(s).
			// Note that the returned message(s) does not have to be an
			// instance of mhub.Message (but it can be).
			//
			// Warning: the program will be terminated when an error is thrown
			// (or the Promise is rejected).
			transform: function(msg) {
				// Example: return a new message with the same data as original
				// message, but different topic.
				return { topic: "some:topic", data: msg.data };
			},
			// Output nodes can again be given as an array (or directly as just
			// one string).
			output: [
				"local/test"
			]
		}
	}
});

relay.start();
```

See `exampleTransform.js` (or its source `exampleTransform.ts`) for a more
elaborate transform function.

## Support

Please Star the project if you like it!
If you find an issue or want to help out, please file an issue on the GitHub
project.

## License

Licensed under the MIT License, see LICENSE.txt.

Copyright (c) 2015 Martin Poelstra <martin@beryllium.net>
