require('dotenv').config();
const RtmClient        = require('@slack/client').RtmClient;
const WebClient        = require('@slack/client').WebClient;
const RTM_EVENTS       = require('@slack/client').RTM_EVENTS;
const fetch            = require('node-fetch');

const { getHelp }      = require('./commands/help');
const { fetchDadJoke } = require('./commands/dadjoke');
const { fetchGif }     = require('./commands/giphy');
const { filterRepo }   = require('./commands/feature/repo_data');

const bot_token = 'xoxb-300355127216-yWPBhi22f2hWJZZhComijNNV';
const rtm              = new RtmClient(bot_token);
const web              = new WebClient(bot_token);

const robotName        = 'Old Ben';
const allCommands      = ['!help', '!echo', '!dadjoke', '!gif', '!feature'];

let users = [];

function executeCommand(command, args, message) {
    switch (command) {
      case '!echo':
        if (message.text === '!echo') {
          rtm.sendMessage( "To use this feature, add a term behind the command. For example: !echo echo.", message.channel)
        } else {
          rtm.sendMessage(args , message.channel);
        }
        break;
      case '!help':
        if (args) {
          rtm.sendMessage(getHelp(command, args, message), message.channel);
        } else {
          rtm.sendMessage("Here are the supported commands--->    " + allCommands.join(",  ") , message.channel);
        }
        break;
      case '!dadjoke':
        fetchDadJoke(args, message)
        .then(data => {
          rtm.sendMessage(data, message.channel)
        });
        break;
      case '!gif':
        fetchGif(command, args, message);
        break;
      case '!feature':
        filterRepo(command, args, message)
        break;
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
    // getting type and text of received message
    if (message.type === 'message' && message.text) {
        const userName = getUsernameFromId(message.user);

        // if user that sent message doesnt match the slackbot name
        if (userName !== robotName) {

            if (message.text.indexOf(robotName) !== -1) {
                rtm.sendMessage('Hey ' + userName + ', I heard that!', message.channel);
            }

            // testing the presence of a command in the text which uses the ! symbol
            if (message.text.indexOf('!') !== -1) {
                allCommands.forEach((command) => {

                    if (message.text.indexOf(command) === 0) {
                        const args = message.text.substring(command.length);
                        executeCommand(command, args.trim(), message);
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

module.exports = {rtm, web, RTM_EVENTS };
