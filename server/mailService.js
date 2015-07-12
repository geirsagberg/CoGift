import nodemailer from 'nodemailer';
import {isValidEmail} from '../common/utils';

var user = process.env.COGIFT_MAIL_USER;
if (!user) {
  throw Error('COGIFT_MAIL_USER not set');
}
var password = process.env.COGIFT_MAIL_PASSWORD;
if (!password) {
  throw Error('COGIFT_MAIL_PASSWORD not set');
}

var transporter = nodemailer.createTransport({
  service: process.env.COGIFT_MAIL_SERVICE || 'Gmail',
  auth: {
    user: user,
    pass: password
  }
});

export function sendMail({to, subject, body}) {
  var mailOptions = {
    from: process.env.COGIFT_MAIL_FROM || user,
    to,
    subject,
    text: body
  };
  if (!isValidEmail(to)) {
    return Promise.reject('Invalid email address');
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}
