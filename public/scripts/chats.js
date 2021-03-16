const chatform = document.getElementById('chatForm')
const chatinput = document.getElementById('chatInput')
const chatmessages = document.getElementById('chatMessages')

chatform.addEventListener('submit', function(e) {
    e.preventDefault()
     console.log(chatinput.value)
    if (chatinput.value) {
        socket.emit('privchat message', chatinput.value);
        chatinput.value = ''
    } 
})

 socket.on('privchat message', function(msg_info) {
    
    const item = document.createElement('li');
    const post = document.createElement('p');
    const author = document.createElement('h5')
    const date = document.createElement('h6')

    const d = new Date();
    const datum = d.getDate()
    const month = d.getMonth()+1
    const fullYear = d.getFullYear()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()
    const currDate = `${fullYear}-${month}-${datum} ${hours}:${minutes}`

    console.log(msg_info)
    date.textContent = currDate
    author.textContent = msg_info.user.user_name
    post.textContent = msg_info.msg
    item.appendChild(author)
    item.appendChild(post)
    item.appendChild(date)
    chatmessages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
}) 


