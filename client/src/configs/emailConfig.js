// import nodemailer from "nodemailer";
// import { google } from "googleapis";
// import dotenv from "dotenv";

// dotenv.config();

// const OAuth2 = google.auth.OAuth2;

// const createTransporter = async () => {
//   const oauth2Client = new OAuth2(
//     process.env.GMAIL_CLIENT_ID,
//     process.env.GMAIL_CLIENT_SECRET,
//     "https://developers.google.com/oauthplayground"
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.GMAIL_REFRESH_TOKEN,
//   });

//   const accessToken = await new Promise((resolve, reject) => {
//     oauth2Client.getAccessToken((err, token) => {
//       if (err) {
//         reject("Failed to create access token :(");
//       }
//       resolve(token);
//     });
//   });

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.GMAIL_USER,
//       accessToken,
//       clientId: process.env.GMAIL_CLIENT_ID,
//       clientSecret: process.env.GMAIL_CLIENT_SECRET,
//       refreshToken: process.env.GMAIL_REFRESH_TOKEN,
//     },
//   });

//   return transporter;
// };

// export default createTransporter;
