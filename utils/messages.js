const moment = require('moment')

function formatMessage(username, text, user_id, channel_id) {
    return {
        username,
        text,
        time: moment().format('h:mm a'),
        user_id,
        channel_id
    }
}

module.exports = formatMessage