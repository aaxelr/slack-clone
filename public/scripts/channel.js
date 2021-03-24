document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('channelForm');
    const input = document.getElementById('channelInput');
    const messages = document.getElementById('channelMessages');
    const dbDeleteBtns = document.querySelectorAll('.delete_icon');
    const dbUpdatePostBtns = document.querySelectorAll('.updatePost');

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

    dbUpdatePostBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            let post_id = e.target.dataset.id
            let new_msg = e.target.parentNode.previousElementSibling.firstElementChild.value
            //updatePost(new_msg, post_id)
            editPost(new_msg, post_id)
        })
    })

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
        const modal = `
        <div class="modal fade" id="editPostModal${post_id}" tabindex="-1" aria-labelledby="editPostModal${post_id}Label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editPostModal${post_id}Label">Edit your post</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input value="${msg_info.msg}" type="text">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button data-bs-dismiss="modal" id="${post_id}" data-post-id="${post_id}" type="button" class="btn btn-primary updatePost">Save changes</button>
                    </div>
                </div>
            </div>
        </div>`

        msg.setAttribute('id', post_id);

        date.textContent = currDate;
        user.textContent = msg_info.user;
        msg.textContent = msg_info.msg;

        edit_btn.textContent = "🖋";
        edit_btn.classList.add('edit_icon');
        edit_btn.setAttribute('data-bs-toggle', 'modal')
        edit_btn.setAttribute('data-bs-target', `#editPostModal${post_id}`)
        edit_btn.setAttribute('data-id', post_id)
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
        item.insertAdjacentHTML('beforeend', modal)
        messages.appendChild(item)
        const saveBtn = document.querySelector(`[data-post-id="${post_id}"]`)
        saveBtn.addEventListener('click', e => {
            let new_msg = e.target.parentNode.previousElementSibling.firstElementChild.value
            editPost(new_msg, post_id)
        })
        window.scrollTo(0, document.body.scrollHeight)
    }

        function editPost(new_msg, post_id) {
            if(document.getElementById(post_id)) {
                let p = document.getElementById(post_id)
                p.textContent = new_msg
                updatePost(new_msg, post_id)
            }
        }

    const socket = io();

    // Join chatroom
    socket.emit('join-room', { username, channel_id })
    
    socket.on('message', ({msg_info, post_id}) => {
        appendMessage(msg_info, post_id);
    });




//////////////// CRUD ////////////////


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

    const updatePost = (new_msg, post_id) => {
        const msg_body = {
            msg: new_msg
        }
        fetch(`/channels/posts/${post_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msg_body)
        })
            .then(response => { })
            .then(data => {
                console.log('post updated')
            })
    }

});

