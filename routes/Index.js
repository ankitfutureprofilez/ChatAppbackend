const routes = require("express").Router()

const userController = require('../controller/userController')

const chatController = require('../controller/aiChatController')

const Aicontroller = require('../controller/Aicontroller')

const jobcontoller= require('../controller/jobcontroller')

const verifyUserToken = require('../middleware/Auth')

routes.post("/findAnswer", chatController.findAnswer)

routes.post('/signup', userController.singup)

routes.post('/login', userController.Login)

routes.get('/user', verifyUserToken, userController.user)

routes.get('/chatmassges', verifyUserToken, userController.userlist)

routes.post('/chat', verifyUserToken, chatController.sendMessage)

routes.get('/chat/:receiveId', verifyUserToken, chatController.chatsMessageList)



routes.post('/conversion', verifyUserToken, chatController.conversion)


routes.post('/job',jobcontoller.jobs)










module.exports = routes