require('dotenv').config();
const fetch = require('node-fetch');

function getHelp(command, args, message) {
  let helpMessage;
  if (args === '!echo') {
    return '!echo Mimics any text after the !echo command';
  } else if (args === '!help') {
    return '!help Lists all currently supported commands.';
  } else if (args === '!dadjoke') {
    return '!dadjoke replies with a randomly chosen dad joke. Try adding a term behind the command to get specific jokes. I.E !dadjoke batman';
  } else if (args === '!gif') {
    return '!gif currently in the works. Try back later.';
  } else if (args === '!feature') {
    return '!feature Adds a project to-do in Generosity_Market/front_end_POC repository. Will support other GM repos soon.';
  } else {
    return args + ' command not regconized. Type !help to see all supported commands.';
  }
}

function fetchGif(command, args, message) {
  console.log("fetchGif(): ", command, args, message);
  return true;
}

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

   return fetch(url, {headers: headers})
    .then(results => {
      return results.json()
    })
    .then(data => {
            console.log("data: ", data);
            // return data;
      if (data.joke) {
        return '"' + data.joke + '"';

      } else if (data.total_jokes !== 0) {
        randomIndex = Math.floor(Math.random() * (data.results.length));
        return '"' + data.results[randomIndex].joke + '"';
      } else {
        let messages = [":wave: " + args + " is not the term you're looking for.",
                        ":rebel_alliance: The jedi archives contain nothing on the term " +  '"' + args + '"',
                        ":bluelightsaber: " + args +  " not found. You'll never win Darth.",
                        ":wave: " + args + " is not the term you're looking for."];
        let randomIndex = Math.floor(Math.random() * messages.length);

        return `${messages[randomIndex]}`
      }
      console.log("MESSAGETOSEND: ", messageToSend);
      return messageToSend;
    })
    .catch(err => {
      return "Error fetching dad jokes: " + err;
    });
};

function addFeature(command, args, message) {
  let urls = [
    {url:'https://api.github.com/repos/Generosity-Market/front_end_POC/projects'},
    {url:'https://api.github.com/projects/1232164/columns'},
    {url:'https://api.github.com/projects/columns/2057714/cards'}
  ];
  let options = {
    method: "POST",
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: process.env.GITHUB_TOKEN,
      'User-Agent': "Jgordy_Old-Ben"
    },
    body: JSON.stringify({note: args})
  }

 return fetch(urls[2].url, options)
          .then(results => {
            return results.json();
          })
          .then(data => {
            return data;
          })
          .catch(err => {
            return err;
          })
}

module.exports = { fetchGif, fetchDadJoke, addFeature, getHelp };
