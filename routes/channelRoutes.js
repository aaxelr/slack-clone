const express = require('express')
const app = express()
const router = express.Router() 

const renderChannel = (req, res) => {
    res.render('channel')
}

router
    .route('/:id')
    .get(renderChannel)
    
    

module.exports = router;