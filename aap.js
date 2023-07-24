// app.js

const express = require('express');
const http = require('http');
const app = express();
const cors = require("cors")
app.use(cors())
const server = http.createServer(app);
require('dotenv').config()
const { Server } = require('socket.io');
const mongoose = require("mongoose")
app.use(express.json())
const apirouter = require('./routes/Index')
app.use("/api", apirouter)
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
            const message = new Chat({
                userId: data.userId,
                receiverId: data.userId, // The ID of the other user in the conversation
                message: data.message,
                time: new Date().toLocaleTimeString(),
            });
            const savedMessage = await message.save();

            // Emit the message to the recipient's socket
            socket.to(data.receiverId).emit('test-event', {
                receiverId: data.userId,
                message: data.message,
                time: new Date().toLocaleTimeString(),
            });

            console.log('Message saved and emitted:', savedMessage);
            console.log('Reciver Mesage:', message);

        } catch (err) {
            console.log(err);
        }
    });

})

// // API endpoint to fetch conversation history for a specific user
// app.get('/api/conversation-history/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const conversation = await Chat.find({
//             $or: [{ userId: userId }, { receiverId: userId }],
//         });
//         res.json(conversation);
//         console.log(conversation)
//     } catch (error) {
//         console.log("Error fetching conversation history:", error);
//         res.status(500).json({ error: "Failed to fetch conversation history" });
//     }
// });





// Start the server
const PORT = process.env.PORT; // Change this to the desired port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

