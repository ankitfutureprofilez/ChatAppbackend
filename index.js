// app.js
//import express from "express"
const express = require('express');

const http = require('http');


const app = express();

const cors = require("cors")

app.use(cors())

const server = http.createServer(app);

require('dotenv').config()

const { Server } = require('socket.io');

const mongoose = require("mongoose")

const bodyParser = require('body-parser')

app.use(bodyParser.json())

const apirouter = require('./routes/Index')

app.use("/api", apirouter)




const password = process.env.password;

mongoose.connect(`mongodb+srv://ankitjain:${password}@cluster0.syimr7w.mongodb.net/test`, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes 
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6 
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error: ', err);
});


const Chat = require('./models/Messages'); // Assuming the correct path to your Messages model

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Change this to the frontend's URL
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.on('join-room', (data) => {
        socket.join(data);
        console.log(`userId is: ${socket.id} join-room ${data}`);
    });
    socket.on('send-message', async (data) => {
        try {
            // Save the message to the database
            const message = new Chat({
                userId: data.sender,
                receiveId: data.receiveId,
                message: data.message,
                time: new Date().toLocaleTimeString(),
            });
            const savedMessage = await message.save();

            // Emit the message to the recipient's socket room
            io.to(data.sender).emit('test-event', {
                receiveId: data.sender,
                userId: data.receiveId,
                message: data.message,
                time: new Date().toLocaleTimeString(),
            });

      //  console.log('Message saved and emitted:', savedMessage);
    /// console.log('Receiver Message:', message);

        } catch (err) {
            console.log(err);
        }
    });
});


// Start the server
const PORT = process.env.PORT; // Change this to the desired port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//ankitjain
//IJBbNvOBcHJxxseC