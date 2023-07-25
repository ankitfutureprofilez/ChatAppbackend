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
const password = process.env.password;

mongoose
  .connect(`mongodb+srv://ankitjain:${password}@cluster0.syimr7w.mongodb.net/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb is Connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
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
         //   console.log('Receiver Message:', message);

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