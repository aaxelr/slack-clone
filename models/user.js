const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: {
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
  is_online: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);