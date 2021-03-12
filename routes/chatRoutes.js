const express = require('express')
const router = express.Router() 

const renderChatInvite = (req, res) => {
    res.render('chatInvite')
}

const createChat = (req, res) => {
    // skapa chat room
    // lägg till invited user
    // vårt id
    // invited users id
    // chatroom id
    const chatRoomId = 123
    res.redirect(`/chats/${chatRoomId}`)
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