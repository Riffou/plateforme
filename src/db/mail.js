const EWS = require('node-ews');

// exchange server connection info
const ewsConfig = {
    username: 'nicolas.riffard@lab-solutec.fr',
    password: 'mL1Q6q20',
    host: 'https://mail.solutec.fr'
};

// initialize node-ews
const ews = new EWS(ewsConfig);

// define ews api function
const ewsFunction = 'CreateItem';

// define ews api function args
const ewsArgs = {
    "attributes" : {
        "MessageDisposition" : "SendAndSaveCopy"
    },
    "SavedItemFolderId": {
        "DistinguishedFolderId": {
            "attributes": {
                "Id": "sentitems"
            }
        }
    },
    "Items" : {
        "Message" : {
            "ItemClass": "IPM.Note",
            "Subject" : "Test EWS Email",
            "Body" : {
                "attributes": {
                    "BodyType" : "Text"
                },
                "$value": "This is a test email"
            },
            "ToRecipients" : {
                "Mailbox" : {
                    "EmailAddress" : "nicolas.riffard@lab-solutec.fr"
                }
            },
            "IsRead": "false"
        }
    }
};

// query ews, print resulting JSON to console
ews.run(ewsFunction, ewsArgs)
    .then(result => {
    console.log(JSON.stringify(result));
})
.catch(err => {
    console.log(err.stack);
});















//var nodemailer = require('nodemailer');

/*
var transporter = nodemailer.createTransport({
    /*
    service: 'mail.solutec.fr',
    port:465,
    auth: {
        user: 'nriffard',
        pass: ''
    },
    secure:true,
    tls:{
        rejectUnauthorized:false
    },
    proxy: 'http://localhost:3128/'
    */


/*
var transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "nicolas.riffard@hotmail.fr",
    },
    proxy: 'http://localhost:3128/'
});

var mailOptions = {
    from: 'nicolas.riffard@hotmail.fr',
    to: 'nicolas.riffard@lab-solutec.fr',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

console.log("Sending mail");
transport.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});

/**
 *
 * This call sends a message to one recipient.
 *
 */

/*
const mailjet = require ('node-mailjet')
    .connect('2f3972f2983a71254b2489528c687d19', '6720b2a831f968687bcc27d1b54f3d09');


// the second argument (the object) is not mandatory. Each configuration key is also optional
const request = mailjet
    .post("send", {
        url: 'api.mailjet.com', version: 'v3', perform_api_call: false
    })
    .request({
        FromEmail: 'nicolas.riffard@lab-solutec.fr',
        FromName: 'Mailjet Pilot',
        Subject: 'Hello world Mailjet!',
        'Text-part': 'Hello World',
        Recipients: [{'Email': 'nicolas.riffard@hotmail.fr'}]
    })

var sendEmail = mailjet.post('send');

var emailData = {
    'FromEmail': 'nicolas.riffard@lab-solutec.fr',
    'FromName': 'My Name',
    'Subject': 'Test with the NodeJS Mailjet wrapper',
    'Text-part': 'Hello NodeJs !',
    'Recipients': [{'Email': 'nicolas.riffard@hotmail.fr'}],
    'Attachments': [{
        "Content-Type": "text-plain",
        "Filename": "test.txt",
        "Content": "VGhpcyBpcyB5b3VyIGF0dGFjaGVkIGZpbGUhISEK", // Base64 for "This is your attached file!!!"
    }]
}

sendEmail
    .request(emailData)
    .then(handlePostResponse)
    .catch(handleError);

console.log("test");

*/

