const express    = require('express');
const app        = express();
const {rtm, web, RTM_EVENTS} = require('./bot/bot');




const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log('listening on port: %s', port);
    rtm.start();
});
