require('dotenv').config();
const WebClient        = require('@slack/client').WebClient;
const web              = new WebClient('xoxb-300355127216-yWPBhi22f2hWJZZhComijNNV');

function sendChatMessage(data, message) {
  web.chat.postMessage(message.channel, 'Feature card added successfully', {
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
}

module.exports = { sendChatMessage }
