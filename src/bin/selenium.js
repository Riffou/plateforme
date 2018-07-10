const webdriverio = require('webdriverio');
const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

const theClient = webdriverio
    .remote(options)
    .init()
    .url('https://www.google.com');