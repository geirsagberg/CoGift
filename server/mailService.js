import nodemailer from 'nodemailer';

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

export function sendMail({ to, subject, text }) {
  var mailOptions = {
    from: process.env.COGIFT_MAIL_FROM || user,
    to,
    subject,
    text
  };
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
