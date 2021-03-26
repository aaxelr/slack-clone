const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

router
	.route('/')
	.get(channelController.renderCreateChannel)
	.post(channelController.createChannel);

router
	.route('/:id')
	.get(channelController.renderChannel);

router
	.route('/posts/:id')
	.delete(channelController.deletePost)
	.patch(channelController.updatePost);

module.exports = router;