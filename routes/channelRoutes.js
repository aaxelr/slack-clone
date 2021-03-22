const express = require('express')
const app = express()
const router = express.Router()
const http = require('http').Server(app);
const io = require('socket.io')(http);


const renderCreateChannel = (req, res) => {
	const User = require('../models/user')

	User
		.find()
		.exec((error, users) => {
			if (error) {
				return handleError(error);
			}
			console.log(users);
			res.render('channelCreate', {
				users
			});
		});
}

const renderChannel = (req, res) => {

	const ChannelPost = require('../models/channelPost')
	const Channel = require('../models/channel')

	Channel
		.findById(req.params.id)
		.populate({
			path: 'posts',
			populate: {
				path: 'author'
			}
		})

		.exec((error, channel) => {
			if (error) {
				return handleError(error)
			}
			console.log(channel)
			res.render('channel', {
				user: req.user,
				channel_id: req.params.id,
				posts: channel.posts
			})
		})

}

const createChannel = (req, res) => {
	const Channel = require('../models/channel');
	const User = require('../models/user');
	const creatorsId = req.user._id;
	const userSelect = req.body.userSelect.split(',');
	let isPrivate;
	if (req.body.isPrivate) {
		isPrivate = true;
	} else {
		isPrivate = false
	}
	
	const channelName = req.body.channelName ? req.body.channelName : `${req.user.name} ${userSelect[1]}`; 
	const description = req.body.description;
	const users = userSelect == null ? [creatorsId] : [userSelect[0], creatorsId];


	Channel
		.findOne({
			channel_name: channelName,
			isPrivate: false
		})
		.exec((error, channel) => {
			if (error) {
				return handleError(error);
			}

			if (channel) {
				console.log('Channel already exists');
				// flash msg
				return res.redirect('/channel')
			}

			newChannel = new Channel({
				users: users,
				admin: creatorsId,
				channel_name: channelName,
				description: description,
				isPrivate: isPrivate

			}).save((error, channel) => {
				if (error) {
					console.log(error);
				}
				const channelId = channel._id;
				console.log(channel);

				User
					.findByIdAndUpdate(creatorsId, {
						$push: {
							channel_rooms: channelId
						}
					})
					.exec((error, user) => {
						if (error) {
							console.log(error);
						}
						console.log(user);
						res.redirect(`/channels/${channelId}`);
						// Send message that new room was created
					});
			});
		});
}

router
	.route('/')
	.get(renderCreateChannel)
	.post(createChannel);

router
	.route('/:id')
	.get(renderChannel);


module.exports = router;