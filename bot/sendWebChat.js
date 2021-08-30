require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_API_KEY);

let successMessages = [
    'That\'s a neat feature!, Don\'t forget to add it to your projects.',
    'I am one with the force, the force is with me.',
    'Issue added, go fill in the intel and add it to your project board.',
    'Meh, I guess that\'ll do. Add it to your projects if you must.',
    'That\'ll do donkey, that\'ll do.',
    'That\'s a neat feature!, Don\'t forget to add it to your projects.'
];

function sendChatMessage(data, message) {
    let randomQuote = Math.floor(Math.random() * successMessages.length);
    web.chat.postMessage(message.channel, successMessages[randomQuote], {
        text: 'Feature card added',
        attachments: [
            {
                fallback: 'Feature card added',
                color: '#2cf',
                author_name: data.user.login,
                author_link: data.user.html_url,
                author_icon: data.user.avatar_url,
                title: data.title,
                title_link: data.html_url,
                text: data.body,
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
        });
};

module.exports = { sendChatMessage };
