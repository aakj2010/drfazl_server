const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/UserModel')
const { generateToken } = require('../utils/token')
const twilio = require("twilio");



// @desc Authenticate new user
// @route POST /api/v1/user/login
// @accesss Public
const registerUser = asyncHandler(async (req, res) => {

    try {
        const { phone } = req.body;

        if (!phone) {
            res.status(400)
            throw new Error('Please add PhoneNumber')
        }

        // Check if user already exists in the database
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }
        // Define Twilio client
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        // Generate random code and send it to user's phone
        const otp = Math.floor(1000 + Math.random() * 9000);
        client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_WHATSUPNUMBER,
            to: `whatsapp:${phone}`
        });


        // Store code and user details in the database
        const newUser = new User({
            phone,
            // password: null, 
            // We'll hash the password after SMS verification
            otp: otp
        });
        const savedUser = await newUser.save();

        if (newUser) {
            res.status(201).json({
                _id: newUser.id,
                phone: newUser.phone,
                token: generateToken(newUser._id),
                message: 'Please enter the code we sent to your phone number'
            })
        } else {
            res.status(400)
            throw new Error('Invalid user data')
        }
    } catch (error) {
        console.log(error);
    }
})



// @desc Authenticate new user
// @route POST /api/v1/user/verify/:id
// @accesss Public
const verifyUser = asyncHandler(async (req, res) => {
    try {
        const { otp } = req.body;
        const { id } = req.params;

        const user = await User.findOne({ _id: id, otp })

        if (!user) {
            res.status(400).json({ success: false, message: "Invalid OTP" });
            return;
        }

        // Mark the user as verified and save the changes to the database
        user.verified = true;
        await user.save();

        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})


// @desc Authenticate new user
// @route POST /api/v1/user/createpassword
// @accesss Public
const createPassword = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const validUser = await User.findOne({ _id: id })

        if (validUser.verified === true) {

            // hash Password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });

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
    const { phone, password } = req.body;

    // Check for user PhoneNumber
    const user = await User.findOne({ phone })
    console.log(user)

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.phone,
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