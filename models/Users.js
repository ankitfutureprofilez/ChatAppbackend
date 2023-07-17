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
        type: String,
        select: false
    },
    confirmPassword: {
        type: String,
        select: false
    }


})


const Singup = mongoose.model('Singups', regSchema);

module.exports = Singup;