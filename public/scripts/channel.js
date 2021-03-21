document.addEventListener('DOMContentLoaded', (e) => {

    const form = document.getElementById('channelForm')
    const input = document.getElementById('channelInput')
    const messages = document.getElementById('channelMessages')

    const d = new Date();
    const datum = d.getDate()
    const month = d.getMonth()+1
    const fullYear = d.getFullYear()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()
    const currDate = `${fullYear}-${month}-${datum} ${hours}:${minutes}`

    const username = document.getElementById('username').value
    const user_id = document.getElementById('id').value
    const channel_id = document.getElementById('channel_id').value


    form.addEventListener('submit', (e) => {
        
        e.preventDefault()
        const msg_info = {
            msg: input.value,
            user: username,
            id: user_id,
            channel_id: channel_id
        }

        if (input.value) {
            // Emit a message to the server
            socket.emit('chat-message', msg_info);
            input.value = '';
        }
    });

    function appendMessage(msg_info) {
        const item = document.createElement('li');
        const msg = document.createElement('p');
        const user = document.createElement('h5')
        const date = document.createElement('h6')

        date.textContent = currDate
        user.textContent = msg_info.user
        msg.textContent = msg_info.msg
        item.appendChild(user)
        item.appendChild(msg)
        item.appendChild(date)
        messages.appendChild(item)
        window.scrollTo(0, document.body.scrollHeight)
    }

    const socket = io();

    // Join chatroom
    socket.emit('join-room', { username, channel_id })

    // message from server
    socket.on('message', msg_info => {
        appendMessage(msg_info)
    })
})















    /* socket.emit('new-user', username) */

    /* socket.on('chat-message', function(msg_info) {
        appendMessage(msg_info)
    })
    socket.on('user-connected', function(username) {
        const user_connected_data = {
            msg: 'connected',
            user: username,
            date: new Date()
        }
        appendMessage(user_connected_data)
    })

    form.addEventListener('submit', function(e) {
        e.preventDefault()
        const msg_info = {
            msg: input.value,
            user: username,
            id: user_id,
            channel_id: channel_id
        }
        appendMessage(msg_info)
        console.log(channel_id)
        if (input.value) {
            socket.emit('send-chat-message', msg_info);
            input.value = ''
        }
    }) */
