const mongoose = require("mongoose");

require('dotenv').config()

module.exports.mongoConnect = () => {
    return mongoose.connect(process.env.MONGOURI)
}