const nodemailer = require('nodemailer');
const { USER_NAME } = require('./../Constants/index');
const { PASS_WORD } = require('./../Constants/index');
const { SMTP_SERVER } = require('./../Constants/index');
const { SMTP_PORT } = require('./../Constants/index');


async function sendMail(from, to, subject, message) {
    var transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false,
        auth: {
            user: USER_NAME,
            pass: PASS_WORD
        }
    });

    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendMail,
}