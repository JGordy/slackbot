require('dotenv').config();
const fetch = require('node-fetch');
const { sendChatMessage } = require('../../sendWebChat');

function addFeature(index, description, message) {
  console.log("INDEX: ", index);
  console.log("DESCRIP: ", description);
  let options = {
    method: index.options.method,
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: process.env.GITHUB_TOKEN,
      'User-Agent': "Jgordy_Old-Ben"
    },
    body: JSON.stringify({title: "Feature Request", body: description})
  }

 return fetch(index.url, options)
          .then(results => {
            return results.json();
          })
          .then(data => {
            sendChatMessage(data, message)
          })
          .catch(err => {
            return err;
          })
}

module.exports = { addFeature };
