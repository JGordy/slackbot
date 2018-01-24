require('dotenv').config();
const RtmClient  = require('@slack/client').RtmClient;
const WebClient  = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const fetch      = require('node-fetch');
const { fetchGif, fetchDadJoke, addFeature, getHelp } = require('./commands');


// const bot_token = process.env.SLACK_API_KEY;
const bot_token = 'xoxb-300355127216-yWPBhi22f2hWJZZhComijNNV';
const rtm       = new RtmClient(bot_token);
const web       = new WebClient(bot_token);

const robotName   = 'Old Ben';
const allCommands = ['!help', '!echo', '!dadjoke', '!gif', '!feature'];

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
<<<<<<< HEAD
        break;
      case '!gif':
        fetchGif(command, args, message);
        break;
=======
        break;
      case '!gif':
        fetchGif(command, args, message);
        break;
      case '!feature':
        addFeature(command, args, message)
        .then(data => {
          console.log('addFeature data: ', data);
          web.chat.postMessage(message.channel, 'Feature card added successfully', {
            text: 'Feature card added',
            attachments: [
              {
                fallback: 'Feature card added',
                color: '#2cf',
                author_name: data.creator.login,
                author_link: data.creator.html_url,
                author_icon: data.creator.avatar_url,
                title: 'Feature details',
                title_link: data.column_url,
                text: data.note,
                footer: "Slack API",
                footer_icon: "https://platform.slack-edge.com/img/default_application_icon.png"
              }
            ]
          })
          .then(res => {
            console.log("RESPONSE: ", res);
          })
          .catch(err => {
            console.log("ERROR: ", err);
          })
        });
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

<<<<<<< HEAD
=======
// rtm.start();

// const port = process.env.PORT || 8001;
// app.listen(port, () => {
//     console.log('listening on port: %s', port);
// });

module.exports = {rtm, web, RTM_EVENTS};
