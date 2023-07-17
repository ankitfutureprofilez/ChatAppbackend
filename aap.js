const express = require("express");
const app = express()
const http = require('http');
const server = http.createServer(app);

const cors = require("cors");
const jwt = require('jsonwebtoken');

require('dotenv').config()

const mongoose = require("mongoose")

const io = require('socket.io')(server, {
    cors: { origin: "http://localhost:3000" },
});

app.use(express.json())
const api = require('./routes/Index')
mongoose.connect(`${process.env.DB_URL}`)
app.use(cors())

io.on("connection", (socket)=> { 
    console.log("socket", socket.id);
    socket.on('chatmessage', (data)=>{
        console.log("Socket Data InNOde  JS", data)
    });
    app.use('/api', api);
});

server.listen(process.env.PORT, () => { console.log(`server is run  ${process.env.PORT}`) })


