const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelMessageSchema = new Schema({
    time_stamp: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post : {
        type: String,
    },
    attachment: {},
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('ChannelMessage', ChannelMessageSchema);