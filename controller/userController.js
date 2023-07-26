const Users = require('../models/Users')
var jwt = require('jsonwebtoken');
require('dotenv').config()

exports.user = (async (req, res) => {
    console.log(req.body)
    try {
        const { name, email, password, username, confirmpasword } = req.body
        const lastuserid = await Users.findOne({}, "userId").sort({ userId: -1 });
        const newUserId = lastuserid ? lastuserid.userId + 1 : 1;
        console.log("newuserID", newUserId)
        let isAlready = await Users.findOne({ username: username });
        //  console.log(isAlready)
        if (isAlready) {
            return res.status(400).json({
                msg: "That user already exisits!",
                status: false
            });
        }
        console.log("last", lastuserid)

        //        Insert the new user if they do not exist yet
        let user = new Users({
            username: username,
            userId: newUserId,
            name: name,
            email: email,
            password: password,
            confirmpasword: confirmpasword
        });
        const results = await user.save();

        console.log("result", results);
        if (results) {
            return res.json({
                msg: "Successfully created !!",
                user: results,
                status: true
            });
        }
    } catch (error) {
        console.log(error)
        res.json(error)
    }
});






exports.Login = (async (req, res) => {

    console.log(req.body)
    try {
        const { username, password } = req.body
        const user = await Users.findOne({ username: username });
        const isPassword = await Users.findOne({ password: password });
        console.log(user, isPassword)
        if (!user || !isPassword) {
            res.json({
                status: false,
                msg: "Invalid login or password"
            });
        }
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "5h",
        });
        console.log(token)
        res.json({
            status: true,
            user: user,
            msg: "Login successfully !!",
            token: token
        });


    } catch (error) {
        console.log(error)
        res.json({
            error: error,
            msg: "Not Login",
            status: false
        });
    }
})


exports.userlist = (async (req, res) => {
    try {
        const usernameToExclude = req.body.username// Replace 'exampleUsername' with the username you want to exclude
        //  console.log(usernameToExclude)
        const record = await Users.find({ username: { $ne: usernameToExclude } });
        //    console.log(record)
        res.json({
            data: record,
            msg: "success",
            status: 200
        });
    } catch (error) {
        console.log(error);
        res.json({
            error: error,
            status: 400,
            msg: "do not access"
        });
    }
});

exports.user = (async (req, res) => {
    try {
        //  console.log("req data", req.user);
        res.status(200).json({
            user: req.user,
            status: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error,
            status: false,
            msg: "something went wrong"
        })
    }
});


