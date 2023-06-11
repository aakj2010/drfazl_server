const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/UserModel')
const { generateToken } = require('../utils/token')
const nodemailer = require("nodemailer");


// email config

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const user = new User({
            email: email,
            otp: otp,
        });
        await user.save();

        let mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'OTP for Signup',
            text: `Your OTP for Signup is ${otp}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.json({
                    message: "OTP sent to email",
                    email: email
                });
            }
        });
    } catch (error) {
        console.log(error)
    }
});

// @desc Authenticate new user
// @route POST /api/v1/user/verify/:id
// @accesss Public
const verifyUser = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const { otp } = req.body;
        const user = await User.findOne({ email, otp });
        // console.log(user)
        if (user) {
            user.verified = true;
            user.otp = undefined;
            await user.save();
            res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            res.status(403).send("Invalid OTP.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



// @desc Authenticate new user
// @route POST /api/v1/user/createpassword
// @accesss Public
const createPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const { password } = req.body;

        const validUser = await User.findOne({ email })

        if (validUser.verified === true) {

            // hash Password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });

            await user.save();

            res.status(201).json({ status: 201, user, message: "Password Created Successfully" })
        } else {

            res.status(401).json({ status: 401, message: "Password Not Created" })

        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Password Not Created" });
    }
})


// @desc Authenticate new user
// @route POST /api/v1/user/login
// @accesss Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user PhoneNumber
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.email,
            token: generateToken(user._id),
            message: "logged in Successfully"

        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


module.exports = {
    registerUser,
    verifyUser,
    createPassword,
    loginUser
}