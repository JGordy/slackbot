require('dotenv').config();
const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const fetch = require('node-fetch');

const { getHelp } = require('./commands/help');
const { fetchDadJoke } = require('./commands/dadjoke');
const { fetchGif } = require('./commands/giphy');
const { filterRepo } = require('./commands/feature/repo_data');

const bot_token = process.env.SLACK_API_KEY;
const rtm = new RtmClient(bot_token);
const web = new WebClient(bot_token);

const robotName = 'Old Ben';
const allCommands = ['!help', '!echo', '!dadjoke', '!gif', '!enhancement', '!bug'];

let users = [];

function executeCommand(command, args, message) {
    switch (command) {
        case '!echo':
            if (message.text === '!echo') {
                rtm.sendMessage("To use this feature, add a term behind the command. For example: !echo echo.", message.channel)
            } else {
                rtm.sendMessage(args, message.channel);
            }
            break;
        case '!help':
            if (args) {
                rtm.sendMessage(getHelp(command, args, message), message.channel);
            } else {
                let newCommands = [];
                allCommands.forEach(index => {
                    newCommands.push("`" + index + "`")
                })
                rtm.sendMessage("*Here are the supported commands--->*    " + newCommands.join(",  ") + "\n\nYou can see what each command does by typing `!help` followed by the command you want to see details of. \n\n*For example:* `!help !dadjoke` will show you the details of the dadjoke command.", message.channel);
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
            rtm.sendMessage(':wave:   This is not the feature you are looking for. (It\'s a work in progress)', message.channel)
            break;
        case '!enhancement':
        case '!bug':
            filterRepo(command, args, message);
            break;
        default:
    }
};

function updateUsers(data) {
    users = data.members;
};

function getUsernameFromId(id) {
    const user = users.find(user => user.id === id);
    return user ? user.real_name : 'unknown member';
};

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    // getting type and text of received message
    if (message.type === 'message' && message.text) {
        const userName = getUsernameFromId(message.user);

        // if user that sent message doesnt match the slackbot name
        if (userName !== robotName) {

            if (message.text.indexOf(robotName) !== -1) {
                rtm.sendMessage('Hey ' + userName + ', I heard that!', message.channel);
            }

            // looking for a 'command', which uses the ! symbol
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

module.exports = { rtm, web, RTM_EVENTS };
