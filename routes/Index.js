const routes = require("express").Router()

const userController = require('../controller/userController')

const chatController = require('../controller/chatController')

const verifyUserToken = require('../middleware/Auth')

const Chat = require('../models/Messages'); // Assuming the correct path to your Messages model


routes.post('/signup', userController.user)

routes.post('/login', userController.Login)

routes.get('/user', verifyUserToken, userController.user)

routes.get('/chatmassges',verifyUserToken,userController.userlist)

routes.post('/chat', verifyUserToken, chatController.sendMessage)

routes.get('/chat/:receiveId', verifyUserToken, chatController.chatsMessageList)


routes.post('/conversion',verifyUserToken,chatController.conversion)


  

//routes.get('/messages/:senderId/:receiverId',verifyUserToken,Chats.hatmessage)c




module.exports = routes