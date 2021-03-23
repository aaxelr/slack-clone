document.addEventListener('DOMContentLoaded', (e) => {
    const form = document.getElementById('channelForm')
    const input = document.getElementById('channelInput')
    const messages = document.getElementById('channelMessages')

    const d = new Date();
    const datum = d.getDate()
    const month = d.getMonth()+1
    const fullYear = d.getFullYear()
    const hours = d.getHours()
    let minutes = d.getMinutes()
    minutes = minutes > 9 ? minutes : '0' + minutes;    
    const currDate = `${fullYear}-${month}-${datum} ${hours}:${minutes}`

    const username = document.getElementById('username_channel').value
    const user_id = document.getElementById('id_channel').value
    const channel_id = document.getElementById('channel_id_channel').value

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
        const edit_btn = document.createElement('a')
        const delete_btn = document.createElement('a')

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

//////////////// CRUD ////////////////

const deletePost = (id, element) => {
    fetch(`/channels/post/${id}`, {
        method: 'DELETE'
    })
    .then(res => {})
    .then(data => {
        alert('Removed a message')
    })
}

