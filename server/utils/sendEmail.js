// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: process.env.EMAIL_USER, // my email
//       pass: process.env.EMAIL_PASS, // app password จาก gg
//     },
//     pool: false,
//     secure: false,
//   });

//   // รายละเอียด email
//   const mailOptions = {
//     from: `Clinic Connect <Ball@testconnect.com>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     html: options.html, // สามารถส่งเป็น HTML สวยๆ ได้
//   };

//   // 3. ส่งอีเมลจริง
//   console.log("User:", process.env.EMAIL_USER); // ต้องไม่ขึ้น undefined
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // เปลี่ยนจาก "sandbox.smtp.mailtrap.io" เป็น IP ของ Mailtrap โดยตรง
    host: "sandbox.smtp.mailtrap.io", 
    port: 587, // หรือลองเปลี่ยนเป็น 587
    auth: {
      user: process.env.EMAIL_USER, //
      pass: process.env.EMAIL_PASS, //
    },
    // บังคับให้ข้ามปัญหาเรื่อง IPv6 และ SSL
    pool: false,
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: '"Clinic Connect" <noreply@clinicconnect.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;