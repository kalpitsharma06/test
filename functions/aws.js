const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const randomstring = require("randomstring");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIAUXML2GTNLZEDRKGK',
    secretAccessKey: 'BMvNdKSIk4YlqMeTeq3TQXiQlXC7vVZNXDAy2GvusHPg',
    region: 'us-east-2'
});

var sns = new AWS.SNS();

module.exports = {
    crypto: function (text, type) {
        var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
        var key = 'password';

        if (type.toString() === 'encrypt') {
            var cipher = crypto.createCipher(algorithm, key);
            var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
            return encrypted;
        } else if (type.toString() === 'decrypt') {
            var decipher = crypto.createDecipher(algorithm, key);
            var dec = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
            return dec;
        }
    },
    randomString: function (len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    sendMail: function ( subject, email, email_data, callback) {


        // Prepare nodemailer transport object
        var transport = nodemailer.createTransport({
            from: 'support@feedme.com',
            host: 'ses-smtp-user.20210701-183840', // hostname
            service:'ses',
            auth: {
                user: 'AKIAUXML2GTNLZEDRKGK',
                pass: 'BMvNdKSIk4YlqMeTeq3TQXiQlXC7vVZNXDAy2GvusHPg'
            }
        });

        // An example users object with formatted email function
        var locals = {
            custom: email_data
         
        }
        console.log(locals)
        locals.site_title = 'FeedMe';

        // Send a single email
       
                transport.sendMail({
                    from: 'feedme <support@feedme.ca>',
                    to: email,
                    subject: subject,
                 
                }, function (err, responseStatus) {
                    console.log(responseStatus)
                    if (err) {
                        console.log("mail sent err ", err)
                        return callback("something_went_wrong", "Something Went Wrong");
                    } else {
                        return callback(null);
                    }
                });
           
    },
}