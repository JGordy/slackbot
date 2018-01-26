const fetch = require('node-fetch');

function fetchGif(command, args, message) {
  console.log("fetchGif(): ", command, args, message);
  return true;
}

module.exports = { fetchGif };
