var CronJob = require('cron').CronJob;

const webdriverio = require('webdriverio');
const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};



new CronJob('*/20 * * * * *', function() {
   // console.log('You will see this message every second');
    webdriverio
        .remote(options)
        .init()
        .url('http://localhost:32771/')
        .end();

}, null, true, 'America/Los_Angeles');