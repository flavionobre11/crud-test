const sgMail = require('@sendgrid/mail');
const { key } = require('../config/apiKeyMail.json')

sgMail.setApiKey(key)


module.exports = sgMail