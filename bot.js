const RtmClient  = require('@slack/client').RtmClient;
const WebClient  = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = 'your-token-here';
const rtm       = new RtmClient(bot_token);
const web       = new WebClient(bot_token);

const allCommands = ['issue', 'OldBen', 'dadjoke', 'help', 'weather', 'stock', 'echo'];
const robotName = 'Old Ben';

function executeCommand(command, args, message) { // this function processes commands
    console.log("COMMAND---->", command);
    console.log("ARGS----->", args); // for now it just logs them to the console
    if (command === 'echo') {
      let user = getUsernameFromId(message.user)
      console.log("message: ",message);
      rtm.sendMessage('@' + user + ' said: ' + args, message.channel);
    }
}

let users = [];

function updateUsers(data) {
  console.log("data: ", data);
    users = data.members;
}

function getUsernameFromId(id) {
    const user = users.find(user => user.id === id);
    return user ? user.real_name : 'unknown member';
}

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    if (message.type === 'message' && message.text) {
        if (message.text.indexOf('!') !== -1) {
            allCommands.forEach((command) => {
                if (message.text.indexOf(command) !== -1) {
                    const args = message.text.substring(command.length + 2);
                    console.log("ARGS: ", args);
                    executeCommand(command, args, message);
                }
            });
        } else {

        }
    }
});

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err);
    } else {
        updateUsers(data);
    }
});


rtm.start();
