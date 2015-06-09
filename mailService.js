import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  service: process.env.COGIFT_MAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.COGIFT_MAIL_USER,
    pass: process.env.COGIFT_MAIL_PASSWORD
  }
});

export function sendMail({to, subject, text}) {
  var mailOptions = {
    from: process.env.COGIFT_MAIL_FROM || process.env.COGIFT_MAIL_USER,
    to,
    subject,
    text
  };
  var promise = new Promise();
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(info.response);
    }
  });
  return promise;
}
