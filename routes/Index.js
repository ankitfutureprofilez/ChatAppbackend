const routes = require("express").Router()

const signups = require('../controller/userController')

const Chats = require('../controller/chatController')

const verifyUserToken = require('../middleware/Auth')

routes.post('/signup', signups.Singup)

routes.post('/login', signups.Login)

routes.get('/chats',verifyUserToken,signups.userlist)

routes.post('/chat', verifyUserToken, Chats.sendMessage)

routes.get('/chat/:userId', verifyUserToken, Chats.chatshow)
routes.get('/user', verifyUserToken, signups.user)



module.exports = routes