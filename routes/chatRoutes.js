const express = require('express')
// const app = express()
const router = express.Router() 
/* const http = require('http').Server(app);
const io = require('socket.io')(http); */


const renderChatInvite = (req, res) => {
    res.render('chatInvite')
}

const createChat = (req, res) => {
    // skapa chat room
    // lägg till invited user
    // vårt id
    // invited users id
    // chatroom id
    res.redirect(`/chats/${ChatRoomId}`)
    
    email = req.body.chatInviteInput
    console.log(email)
    res.redirect('')
}

const renderChatRoom = (req, res) => {
    res.render('chatRoom')
}

router
    .route('/')
    .get(renderChatInvite)
    .post(createChat)
    
router
    .route('/:id')
    .get(renderChatRoom)
    
    
module.exports = router;