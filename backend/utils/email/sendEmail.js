const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const smtpTransport = require('nodemailer-smtp-transport')

const fs = require("fs");
const path = require("path");

const emailService = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  auth: {
    user: 'wakafbwi@gmail.com',
    pass: 'WAKAFBWI123'
  },
  tls: {
    rejectUnauthorized: false
  }
}));

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = emailService;
