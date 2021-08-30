const fetch = require('node-fetch');

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

    return fetch(url, { headers: headers })
        .then(results => {
            return results.json()
        })
        .then(data => {
            if (data.joke) {
                return '"' + data.joke + '"';

            } else if (data.total_jokes !== 0) {
                randomIndex = Math.floor(Math.random() * (data.results.length));
                return '"' + data.results[randomIndex].joke + '"';
            } else {
                let messages = [":wave: " + args + " is not the term you're looking for.",
                ":rebel_alliance: The jedi archives contain nothing on the term " + '"' + args + '"',
                ":bluelightsaber: " + args + " not found. You'll never win Darth.",
                ":wave: " + args + " is not the term you're looking for."];
                let randomIndex = Math.floor(Math.random() * messages.length);

                return `${messages[randomIndex]}`
            }
            return messageToSend;
        })
        .catch(err => {
            return "Error fetching dad jokes: " + err;
        });
};

module.exports = { fetchDadJoke };
