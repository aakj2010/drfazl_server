const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require('./config/database');
const cors = require("cors");
const app = express()


dotenv.config({ path: path.join(__dirname, "/.env") })
connectDatabase()

const port = process.env.PORT || 5000

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Server Is Running")
})


app.use('/api/v1/user', require('./routes/userRoutes'))


app.listen(port, () => {
    console.log(`Server Running on ${port} in ${process.env.NODE_ENV}`);
})