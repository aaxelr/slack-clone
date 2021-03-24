document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('channelForm');
    const input = document.getElementById('channelInput');
    const messages = document.getElementById('channelMessages');
    const dbDeleteBtns = document.querySelectorAll('.delete_icon');

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

    dbDeleteBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            deletePost(btn.dataset.id, e.target);
        });
    });

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

    function appendMessage(msg_info, post_id) {
        const item = document.createElement('li');
        const msg = document.createElement('p');
        const user = document.createElement('h5');
        const date = document.createElement('h6');
        const edit_btn = document.createElement('button');
        const delete_btn = document.createElement('button');

        date.textContent = currDate;
        user.textContent = msg_info.user;
        msg.textContent = msg_info.msg;

        edit_btn.textContent = "🖋";
        edit_btn.classList.add('edit_icon');
        //edit_btn.addEventListener('click', e => {})
        delete_btn.textContent = "❌";
        delete_btn.classList.add('delete_icon');
        delete_btn.addEventListener('click', e => {
            deletePost(post_id, e.target);
        });
        item.appendChild(user)
        item.appendChild(msg)
        item.appendChild(date)
        item.appendChild(delete_btn)
        item.appendChild(edit_btn)
        messages.appendChild(item)
        window.scrollTo(0, document.body.scrollHeight)
    }

    const socket = io();

    // Join chatroom
    socket.emit('join-room', { username, channel_id })
    
    socket.on('message', ({msg_info, post_id}) => {
        console.log(post_id);
        appendMessage(msg_info, post_id);
    });
});

//////////////// CRUD ////////////////

// const editPost ...

const deletePost = (id, element) => {
    fetch(`/channels/posts/${id}`, {
        method: 'DELETE'
    })
    .then(res => {})
    .then(data => {
        element.parentNode.remove()
        alert('Removed a message')
        
    })
}

