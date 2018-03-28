var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'lab-solutec.fr',
    auth: {
        user: 'nicolas.riffard@lab-solutec.fr',
        pass: 'mL1Q6q20'
    },
    proxy: 'http://localhost:3128/'
});

var mailOptions = {
    from: 'nicolas.riffard@lab-solutec.fr',
    to: 'nicolas.riffard@lab-solutec.fr',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

console.log("Sending mail");
transporter.sendMail(mailOptions, function(error, info){
    console.log("test");
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

