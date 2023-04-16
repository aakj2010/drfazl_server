const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
const path = require("path");


dotenv.config({ path: path.join(__dirname, "config/.env") })

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    // console.log("hello")
    console.log(`Token is "${token}"`);
    return token
}

module.exports = { generateToken }