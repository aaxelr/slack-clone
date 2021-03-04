const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    time_stamp: {
        type: Date,
        default: Date.now()
    },
    users: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    messages : [{
        type: Schema.Types.ObjectId,
        ref: 'ChatMessage'
    }] 
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);