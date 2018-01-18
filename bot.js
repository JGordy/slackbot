const RtmClient  = require('@slack/client').RtmClient;
const WebClient  = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = 'your-token-here';
const rtm       = new RtmClient(bot_token);
const web       = new WebClient(bot_token);

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {});
rtm.start();
