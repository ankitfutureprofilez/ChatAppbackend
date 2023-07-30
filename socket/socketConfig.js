
const io = require('socket.io')(server, {
    cors: { origin: "https://chat-appbackend-kbvv.vercel.app" },
});

io.on("connection", (socket) => {
    console.log("socket", socket.id);
    socket.on('chatmessage', (data) => {
        console.log("Socket Data InNOde  JS", data)
    });
    app.use('/api', api);
});