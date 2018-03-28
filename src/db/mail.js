var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'securite.solutec@gmail.com',
        pass: 'injectionsql'
    }
});

var mailOptions = {
    from: 'securite.solutec@gmail.com',
    to: 'nicolas.riffard@lab-solutec.fr',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

console.log("bonjour");
transporter.sendMail(mailOptions, function(error, info){
    console.log("mail");
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});