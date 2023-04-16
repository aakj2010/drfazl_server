const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost/register-otp-verification", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define user schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  otp: String,
});

// Define user model
const User = mongoose.model("User", userSchema);

// Define Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Routes
app.post("/register", async (req, res) => {
  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const { name, email, phone } = req.body;
    const user = new User({ name, email, phone, otp });
    await user.save();

    // Send OTP via SMS
    const message = `Your OTP is ${otp}`;
    await client.messages.create({ body: message, from: "+15017122661", to: phone });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone, otp });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid OTP" });
      return;
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
