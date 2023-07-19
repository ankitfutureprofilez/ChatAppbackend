const mongoose = require("mongoose")


const regSchema = mongoose.Schema({


    userId: {
        type: Number
    },
    username: {
        type: String,
        trim: true,
        required: true,

    },

    name: {
        type: String,
        trim: true,
        required: true
    },
    email: String,
    password: {
        type: Number

    },
    confirmpasword: {
        type: Number

    }


})


const Singup = mongoose.model('Singups', regSchema);

module.exports = Singup;