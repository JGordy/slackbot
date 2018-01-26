require('dotenv').config();
const fetch               = require('node-fetch');
const { sendChatMessage } = require('../../sendWebChat');

function addFeature(index, description, message) {
  let body;
  if (description.includes(';')) {
    let info = description.split(';');
    body = {
      title: info[0],
      body: info[2],
      labels: [ info[1] ]
    }
  } else {
    body = {
      title: 'Feature Request',
      body: description
    }
  }

  let options = {
    method: index.options.method,
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: process.env.GITHUB_TOKEN,
      'User-Agent': "Jgordy_Old-Ben"
    },
    body: JSON.stringify(body)
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
