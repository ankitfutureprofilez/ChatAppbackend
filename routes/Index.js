const routes = require("express").Router()

const signups = require('../controller/userController')

const Chats = require('../controller/chatController')

const verifyUserToken = require('../middleware/Auth')

const Chat = require('../models/Messages'); // Assuming the correct path to your Messages model


routes.post('/signup', signups.Singup)

routes.post('/login', signups.Login)

routes.patch('/login/:id', signups.Login)
routes.get('/user', verifyUserToken, signups.user)

routes.get('/chatmassges',verifyUserToken,signups.userlist)

routes.post('/chat', verifyUserToken, Chats.sendMessage)

routes.get('/chat/:receiveId', verifyUserToken, Chats.chatsMessageList)


routes.get('', signups.test)


  

//routes.get('/messages/:senderId/:receiverId',verifyUserToken,Chats.hatmessage)c




module.exports = routes