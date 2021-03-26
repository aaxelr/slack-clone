const express = require('express');
const router = express.Router();

const ChannelPost = require('../models/channelPost');
const Channel = require('../models/channel');
const User = require('../models/user');

const renderCreateChannel = (req, res) => {
	User
		.find()
		.exec((error, users) => {
			if (error) {
				return handleError(error);
			}
			console.log(users);
			res.render('channelCreate', { users });
		});
}

const renderChannel = (req, res) => {
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
				return handleError(error);
			}
			res.render('channel', {
				user: req.user,
				channel_id: req.params.id,
				posts: channel.posts
			});
		});
}

const createChannel = (req, res) => {
	const creatorsId = req.user._id;
	const userSelect = req.body.userSelect.split(',');
	let isPrivate;
	if (req.body.isPrivate) {
		isPrivate = true;
	} else {
		isPrivate = false;
	}

	const channelName = req.body.channelName ? req.body.channelName : `${req.user.name} ${userSelect[1]}`;
	const description = req.body.description;
	const users = userSelect == 'null' ? [creatorsId] : [userSelect[0], creatorsId];

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
				return res.redirect('/channel');
			}

			newChannel = new Channel({
				users,
				admin: creatorsId,
				channel_name: channelName,
				description,
				isPrivate
			}).save((error, channel) => {
				if (error) {
					return console.log(error);
				}

				const channelId = channel._id;

				User
					.findByIdAndUpdate(creatorsId, {
						$push: {
							channel_rooms: channelId
						}
					})
					.exec((error, user) => {
						if (error) {
							return console.log(error);
						}
						res.redirect(`/channels/${channelId}`);
					});
			});
		});
}

const deletePost = (req, res) => {
	const postId = req.params.id;

	ChannelPost
		.findByIdAndDelete(postId)
		.exec((error, post) => {
			if (error) {
				return console.log(error);
			}

			Channel
				.updateOne({
					posts: postId
				}, {
					$pull: {
						posts: postId
					}
				})
				.exec((error, post) => {
					if (error) {
						return console.log(error);
					}
				});
			res.end();
		});
}

const updatePost = (req, res) => {
	const postId = req.params.id

	ChannelPost
		.findByIdAndUpdate(postId, {
			post: req.body.msg
		})
		.exec((error, post) => {
			if (error) {
				return console.log(error);
			}

			res.end()
		});
}

router
	.route('/')
	.get(renderCreateChannel)
	.post(createChannel);

router
	.route('/:id')
	.get(renderChannel);

router
	.route('/posts/:id')
	.delete(deletePost)
	.patch(updatePost);

module.exports = router;