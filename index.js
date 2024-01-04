//NPM Packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

//Utils
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
const { sendVerificationCodeToEmail } = require("./Mailer");

//Send Email
app.post("/send-email", sendVerificationCodeToEmail);

//Connect Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Your app is running on PORT ${PORT}`);
});
