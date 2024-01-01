const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const path = require('path')
const dotenv = require('dotenv');
const auth = require('./routes/auth')

dotenv.config({ path: path.join(__dirname, ".env") })



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true
}))


app.use('/api/v1/', auth);

if (process.env.NODE_ENV === "production") {
    express.static
}

app.use(errorMiddleware)

module.exports = app;