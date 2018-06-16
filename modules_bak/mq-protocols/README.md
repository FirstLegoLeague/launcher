# Protocols

For our FIRST LEGO League architecture, we use separate systems that can communicate via JSON REST api's or via websocket protocol. These are described here

## Architecture

Our software is written by volunteer developers. We acknowledge that volunteers come and go and as a result, bits of software get obsolete. When a lead developer of some software package stops contributing, it can be hard for new developers to keep maintaining the software. Also, as time progresses, new technologies become available.

To be flexible in the above scenario's we build an eco system as standalone packages, tailored to fulfill a specific need. This way, packages can be abandoned, improved or rewritten, without disturbing the other packages significantly.

However, packages may need to communicate. This communication breaks down into two types:

- events and control, which we solve by sending messages over a websocket layer
- data, which we solve by exposing a REST API

Communication needs a standard. Our way of working is as follows:

- every one is welcome to create new software, in any language, using any architecture.
- when you need to listen to messages from other systems, or need data from other systems, consult this repository for the specifics
- when your system creates events or data, we encourage you to formalize it, by contributing a pull request to this repository. This way, other systems can benefit from your work.

## Examples

- our [display system](https://github.com/FirstLegoLeague/displaySystem) sends messages when control buttons are pressed. These control the display system itself, but for example our [standalone clock](https://github.com/FirstLegoLeague/clock) also listens to the messages for the clock. This way, both the embedded clock as well as the standalone clock can be started and stopped by one controller.

## websocket protocol

We mostly use [mhub](https://github.com/poelstra/mhub) as a websocket broker, which simplifies things a lot. However, the underlying mechanism is just raw websockets, which you can just use as well. A sample implementation for an online JavaScript client goes as follows:

    ws = new WebSocket(config.wsHost);
    ws.onopen = function() {
        ws.send(JSON.stringify({
            type: "subscribe",
            node: "overlay"
        }));
    };
    ws.onerror = function(e){
        console.log("error", e);
    };
    ws.onclose = function() {
        console.log("close");
    };
    ws.onmessage = function(msg) {
        var data = JSON.parse(msg.data);
        handleMessage(data);
    };

You'd need to implement the `handleMessage` function yourself.

Note that the websocket protocol can only send strings. Hence the `JSON.stringify` and `JSON.parse` calls in the above sample implementation. In this specifications, we use json to denote the format, although this is serialized for transport.

The generic message format is as follows:

	{
		type: "publish",
		node: "overlay",
		topic: "foo:bar",
		data: {} 
	}

The node is specified by your application, mhub is able to route messages over various nodes. Our display system, for example, uses the `overlay` node. The node is not a part of a message specification.

The topic is specific for a goal. We usually add a namespace to the topic by prepending it. For instance, for our display system, we have the topics `clock:show` and `time:show`, which are similar actions, but for different subsystemes. In the future we foresee advanced routing based on namespaces in mhub.

The data contains data specific to a topic.

In general, topic and data together can be seen as a remote function call.

With mclient, which comes with mhub you can manually send messages like this:

	mclient -n overlay -t clock:arm -d '{"countdown":30}'

For more information, see the [mhub repository](https://github.com/poelstra/mhub).

## specifications

### clock

- `clock:show` shows the clock
- `clock:hide` hides the clock
- `clock:arm` data: `{countdown:<number>}` arms (resets) the clock, without data uses previous set arm time
- `clock:start` data: `{countdown:<number>}` countdown is seconds to countdown from, without data uses previous set arm time
- `clock:stop` stops the clock, and leave it at the countdown time
- `clock:pause` pauses the clock when running, and resumes it when paused (toggle)
- `clock:nudge` data: `{direction:<x|y>,amount:<number>}` moves the clock in x or y direction by the given number of pixels
- `clock:size` data: `{amount:<number>}` increases the font size by the given number of pixels
