const express = require("express");
const app = express()

const http = require('http')
const cors = require("cors");
const jwt = require('jsonwebtoken');
const api = require('./routes/Index')
const { Server } = require("socket.io")
app.use(express.json())
app.use(cors())
require('dotenv').config()

const mongoose = require("mongoose")
mongoose.connect(`${process.env.DB_URL}`)
app.use('/api', api);
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"]
    },
})


io.on("connection", (socket) => {
    console.log(`User Connected ${socket.id}`);

    socket.on("join-room", (data) => {
        socket.join(data);0
        console.log(`user Connected ${socket.id} data ${data}`)
    })
    socket.on("send-message", (data) => {
        socket.emit("recive-message", data)

    })
    socket.on("disconnect", () => {
        console.log("User DisConnected", socket.id)
    })
})

server.listen(process.env.PORT, () => { console.log(`server is run  ${process.env.PORT}`) })






