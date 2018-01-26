const express    = require('express');
const app        = express();
const {rtm, web, RTM_EVENTS} = require('./bot/bot');


let description = "title;tag;text";
let split = description.split(';');

split.forEach(index => {
  console.log(index);
})




const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log('listening on port: %s', port);
    rtm.start();
});
