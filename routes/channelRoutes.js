const express = require('express')
const app = express()
const router = express.Router() 
const http = require('http').Server(app);
const io = require('socket.io')(http);


const renderCreateChannel = (req, res) => {
    res.render('channelCreate')

}

const renderChannel = (req, res) => {

	const ChannelPost = require('../models/channelPost')
	const Channel = require('../models/channel')

	Channel
		.findById(req.params.id)
		.populate({
			path: 'posts',
    		populate : {
      		path : 'author'
			}
  		})

		.exec((error, channel) => {
            if (error) {
                return handleError(error)
            }
            console.log(channel)
			res.render('channel', {user: req.user, channel_id: req.params.id, posts: channel.posts})
        })

}

const createChannel = (req, res) => {
    const Channel = require('../models/channel')
    const User = require('../models/user')
    const creatorsId = req.user._id;
	const channelName = req.body.channelNameInput;

	Channel
		.findOne({
			channel_name: channelName
		})
		.exec((error, channel) => {
			if (error) {
				return handleError(error);
			}

			if (channel) {
				console.log('name already exists');
				// flash msg
                return res.redirect('/channel')
			}

			newChannel = new Channel({
				users: creatorsId,
                admin: creatorsId,
                channel_name: channelName,
				isPrivate: false

			}).save((error, channel) => {
				if (error) {
					console.log(error);
				}
				const channelId = channel._id;
				console.log(channel)
				
				User
					.findByIdAndUpdate(creatorsId, {
                        $push: { channel_rooms: channelId}
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
    .post(createChannel)

router
    .route('/:id')
    .get(renderChannel)
    
    

module.exports = router;