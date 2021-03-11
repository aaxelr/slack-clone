const express = require('express')
const app = express()
const router = express.Router() 
const http = require('http').Server(app);
const io = require('socket.io')(http);


const renderChannel = (req, res) => {
    res.render('channel')

}

router
    .route('/:id')
    .get(renderChannel)
    
    

module.exports = router;