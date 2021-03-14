const express = require('express');
const router = express.Router();

const ChatRoom = require('../models/chatRoom');
const User = require('../models/user');

const renderChatInvite = (req, res) => {
	res.render('chatInvite')
}

const createChat = (req, res) => {
	const creatorsId = req.user._id;

	const inviteEmail = req.body.chatInviteInput;

	User
		.findOne({
			email: inviteEmail
		})
		.exec((error, user) => {
			if (error) {
				return handleError(error);
			}

			if (!user) {
				console.log('no such user');
				// flash msg
			}

			newChatRoom = new ChatRoom({
				users: [creatorsId, user._id]
			}).save((error, room) => {
				if (error) {
					console.log(error);
				}
				const chatRoomId = room._id;

				User
					.updateMany(
						{$or: [{_id: creatorsId}, {_id: user._id} ]},
						{ chat_rooms: room._id })
					.exec((error) => {
						if (error, user) {
							console.log(error);
						}
						console.log(user);
						res.redirect(`/chats/${chatRoomId}`);
					});
			});
		});
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