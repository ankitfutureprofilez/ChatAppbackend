const routes = require("express").Router()

const userController = require('../controller/userController')

const chatController = require('../controller/chatController')

const verifyUserToken = require('../middleware/Auth')

routes.post("/findAnswer",verifyUserToken,chatController.findAnswer)

routes.post('/signup', userController.singup)

routes.post('/login', userController.Login)

routes.get('/user', verifyUserToken, userController.user)

routes.get('/chatmassges', verifyUserToken, userController.userlist)

routes.post('/chat', verifyUserToken, chatController.sendMessage)

routes.get('/chat/:receiveId', verifyUserToken, chatController.chatsMessageList)


routes.post('/conversion', verifyUserToken, chatController.conversion)








module.exports = routes