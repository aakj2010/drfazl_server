// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cryptoRandomString = require("crypto-random-string");
// const nodemailer = require(" ");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const User = mongoose.model("User", new mongoose.Schema({
//     email: String,
//     otp: String,
// }));

// app.use(cors());
// app.use(bodyParser.json());

// // email config

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     }
// })

// app.post("/api/signup", async (req, res) => {
//     const otp = cryptoRandomString({ length: 6, type: 'numeric' });
//     const user = new User({
//         email: req.body.email,
//         otp: otp,
//     });
//     await user.save();


//     let mailOptions = {
//         from: 'noreply@yourdomain.com',
//         to: req.body.email,
//         subject: 'OTP for Signup',
//         text: `Your OTP for Signup is ${otp}`
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//             res.status(500).send(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//             res.send("OTP sent to email!");
//         }
//     });
// });

// app.post("/api/verify", async (req, res) => {
//     const user = await User.findOne({ email: req.body.email });
//     if (user.otp === req.body.otp) {
//         user.otp = undefined;
//         await user.save();
//         res.send("OTP verified!");
//     } else {
//         res.status(403).send("Invalid OTP.");
//     }
// });

// app.listen(8000, () => {
//     console.log("Server started on port 8000");
// });
