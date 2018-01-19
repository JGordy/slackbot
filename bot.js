const RtmClient  = require('@slack/client').RtmClient;
const WebClient  = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const fetch      = require('node-fetch');

const bot_token = 'your-token-here';
const rtm       = new RtmClient(bot_token);
const web       = new WebClient(bot_token);

const robotName   = 'Old Ben';
const allCommands = ['!help', '!echo', '!dadjoke'];

let users = [];

function fetchDadJoke(args, message) {
  let url,
      messageToSend,
      randomIndex,
      headers = {
        method: "GET",
        accept: "application/json",
        "User-Agent": "https://github.com/JGordy/slackbot"
      };

  if (args) {
    url = `https://icanhazdadjoke.com/search?term=${args}`;
  } else {
    url = 'https://icanhazdadjoke.com/';
  }

  fetch(url, {headers: headers})
    .then(results => {
      return results.json()
    })
    .then(data => {
      console.log(data);
      if (data.joke) {
        console.log("joke detected: ", data.joke);
        messageToSend = '"' + data.joke + '"';
      } else if (data.total_jokes !== 0) {
        randomIndex = Math.floor(Math.random() * (data.results.length));
        messageToSend = '"' + data.results[randomIndex].joke + '"';
      } else {
        messageToSend = "Nothing found for the term " +  '"' + args + '"';
      }
      rtm.sendMessage(messageToSend, message.channel)
    })
    .catch(err => {
      rtm.sendMessage("Error fetching dad jokes: " + err , message.channel)
    });

};

function executeCommand(command, args, message) {
    switch (command) {
      case '!echo':
        rtm.sendMessage(args , message.channel);
        break;
      case '!help':
        rtm.sendMessage("Here are the supported commands--->    " + allCommands.join(",  ") , message.channel);
        break;
      case '!dadjoke':
        fetchDadJoke(args, message);
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

rtm.start();
