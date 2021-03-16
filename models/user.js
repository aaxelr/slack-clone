const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  chat_rooms: [{
    type: Schema.Types.ObjectId,
    ref: 'ChatRoom'
  }],
  channels: [{
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  }],
  is_online: { // är det här verkligen db's jobb??? 
    type: Boolean,
    default: false
  },
  profile_pic: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);