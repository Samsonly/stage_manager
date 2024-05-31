// import createTransporter from "../configs/emailConfig.js";

// const sendEmail = async (to, subject, text, attachments) => {
//   const transporter = await createTransporter();
//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to,
//     subject,
//     text,
//     attachments,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.log("Error sending email: " + error);
//   }
// };

// export default sendEmail;
