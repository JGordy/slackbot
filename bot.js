const RtmClient  = require('@slack/client').RtmClient;
const WebClient  = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var fetch = require('node-fetch');

const bot_token = 'xoxb-300355127216-hlFCMLD1IRTAVS3BiLGsnBgy';
const rtm       = new RtmClient(bot_token);
const web       = new WebClient(bot_token);

const robotName   = 'Old Ben';
const allCommands = ['!echo', '!help', '!dadjoke'];

let users = [];

function fetchDadJoke(args, message) {
  let headers = {
    method: "GET",
    accept: "application/json",
    "User-Agent": "https://github.com/JGordy/slackbot"
  }
  fetch('https://icanhazdadjoke.com/', {headers: headers})
  .then(results => {
    return results.json()
  })
  .then(data => {
    rtm.sendMessage('"' + data.joke + '"' , message.channel)
  })
  .catch(err => {
    console.log("error: ", err);
  })
}

function executeCommand(command, args, message) {
    switch (command) {
      case '!echo':
        rtm.sendMessage(args , message.channel);
        break;
      case '!help':
        rtm.sendMessage("Here are the supported commands--->    " + allCommands.join(",  ") , message.channel);
      case '!dadjoke':
        fetchDadJoke(args, message);
      default:

    }
}

function updateUsers(data) {
    users = data.members;
}

function getUsernameFromId(id) {
    const user = users.find(user => user.id === id);
    return user ? user.real_name : 'unknown member';
}

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {

    if (message.type === 'message' && message.text) {
        const userName = getUsernameFromId(message.user);

        if (userName !== robotName) {

            if (message.text.indexOf(robotName) !== -1) {
                rtm.sendMessage('Hey ' + userName + ', I heard that!', message.channel);
            }

            if (message.text.indexOf('!') !== -1) {
                allCommands.forEach((command) => {

                    if (message.text.indexOf(command) === 0) {
                        const args = message.text.substring(command.length);
                        executeCommand(command, args, message);
                    }
                });
            }
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
