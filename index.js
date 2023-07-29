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


// const { Configuration, OpenAIApi } = require("openai");

// const ApiKey = process.env.OPENAI_API_KEY

// const configuration = new Configuration({
//     apiKey: ApiKey,
// });

// const openai = new OpenAIApi(configuration);
// //console.log("openai", openai)
// app.post("/find", async (req, res) => {
//     try {
//         const completion = await openai.createCompletion({
//             model: "text-davinci-001",
//             prompt: "Whats is the capital of india??",
//         });
//         console.log(completion.data.choices[0].text);
//         res.json({
//             response: completion.data.choices[0].text,
//             status: 200

//         })
//     } catch (error) {
//         console.log(error)
//     }

// })

const apirouter = require('./routes/Index')

app.use("/api", apirouter)

mongoose.connect(`${process.env.DB_URL}`, {
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

app.get('/',(req,res)=>{
    res.json({
        "msg":"Herrr",
        status:true
    })
})





const Chat = require('./models/Messages'); // Assuming the correct path to your Messages model

const io = new Server(server, {
    cors: {
        origin: 'https://chat-app-plum-chi.vercel.app', // Change this to the frontend's URL
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
                receiveId: data.receiveId,
                message: data.message,
                time: new Date().toLocaleTimeString(),
            });
            const savedMessage = await message.save();

            // Emit the message to the recipient's socket room
            io.to(data.userId).emit("test-event", {
                receiveId: data.receiveId,
                author: data.username,
                userId: data.userId,
                message: data.message,
                time: new Date().toLocaleTimeString(),
              });
            console.log('Message saved and emitted:', savedMessage);
            console.log('Receiver Message:', message);
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