const routes = require("express").Router()

const signups = require('../controller/userController')

const Chats = require('../controller/chatController')

const verifyUserToken = require('../middleware/Auth')


routes.post('/signup', signups.Singup)

routes.post('/login', signups.Login)


routes.post('/chat', verifyUserToken, Chats.Chat)

routes.get('/chat', verifyUserToken, Chats.chatshow)



module.exports = routes