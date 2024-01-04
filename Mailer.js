const nodemailer = require("nodemailer");
const { google } = require("googleapis");

SMTP_EMAIL = "ridesrides.com@gmail.com";
CLIENT_ID =
  "808681603339-o19sd9ik4f65csgmsguuq0se0sd4tq83.apps.googleusercontent.com";
CLIENT_SECRET = "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";
REDIRECT_URI = "https://developers.google.com/oauthplayground";
REFRESH_TOKEN =
  "1//04l8dJbhvKLPqCgYIARAAGAQSNwF-L9Ir6ETaCjNJBbu4aa4WTJ2ZkrAc8E285ibTvG7EF3zAoIrY3X4tjDi7Hkq0xrVkNtVpTtM";

//Setting up oAuth
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (email, html, subject) => {
  //Sending Email
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    //SMPT Transport
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SMTP_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    //Mailing Options
    const mailOptions = {
      from: `noreply ${process.env.SMTP_EMAIL}`,
      to: email,
      html,
      subject,
    };

    const result = await smtpTransport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.sendVerificationCodeToEmail = async (req, res) => {
  const { email, code } = req.body;

  console.log({ email, code });
  let html =
    '<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">';
  html += '<div style="margin:50px auto;width:70%;padding:20px 0">';
  html += `<div style="border-bottom:1px solid gray">`;
  html += `<a href="" style="font-size:1.4em;color: #000000;text-decoration:none;font-weight:600">Rides</a>`;
  html += "</div>";
  html += '<p style="font-size:1.1em">Hi,</p>';
  html += `<p>Thank you for choosing Rides. Use the following OTP to complete your Verification Procedure. OTP is valid for 5 minutes</p>`;
  html += `<h2 style="background: #000000;margin: 0 auto;width: max-content;padding: 0 10px;color: white;border-radius: 4px;">`;
  html += code;
  html += "</h2>";
  html += `<p style="font-size:0.9em;">Regards,<br />Admin Rides</p>`;
  html += `<hr style="border:none;border-top:1px solid gray" />`;
  html += "</div>";
  html += "</div>";

  sendEmail(email, html, "Verify Your Account")
    .then((result) => {
      console.log("Sending Email Success");
      return res
        .status(200)
        .json({ status: true, msg: "Email sent successfully" });
    })
    .catch((error) => {
      console.log("Sending Email Error");
      console.log(error);
      return res.status(400).json({ status: false, msg: error });
    });
};
