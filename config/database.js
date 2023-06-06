const mongoose = require('mongoose');
mongoose.set("strictQuery", true);

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(conn => {
        console.log(`MonoDB is Connected to host: ${conn.connection.host}`);
    })
        .catch(() => {
            console.log(error);
        })
}
module.exports = connectDatabase