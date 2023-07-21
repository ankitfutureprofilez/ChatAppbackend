// app.js

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
require('dotenv').config()
const { Server } = require('socket.io');
const mongoose = require("mongoose")

mongoose.connect(`${process.env.DB_URL}`)
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
            const chatMessage = new Chat({
                message: data.message,
                userId: data.senderId,
            });
            const savedMessage = await chatMessage.save();

            // Emit the message to the recipient's socket
            io.to(data.receiverId).emit('receive-message', { message: data.message, senderId: data.senderId });
            console.log("recive-mesage", data.message)
            console.log('Message saved and emitted:', savedMessage);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('userDisconnect', socket.id);
    });
});




// Start the server
const PORT = process.env.PORT; // Change this to the desired port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

