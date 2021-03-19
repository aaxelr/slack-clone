const socket = io();

const form = document.getElementById('channelForm');
const input = document.getElementById('channelInput');
const messages = document.getElementById('channelMessages');
//const enterRoomBtns = document.getElementsByClassName('enter-room');

const d = new Date();
const datum = d.getDate();
const month = d.getMonth() + 1;
const fullYear = d.getFullYear();
const hours = d.getHours();
const minutes = d.getMinutes();
const seconds = d.getSeconds();
const currDate = `${fullYear}-${month}-${datum} ${hours}:${minutes}`;

// ev byta hidden inputs mot fetch om tid finnes?
const username = document.getElementById('username').value;
const user_id = document.getElementById('id').value;
const channel_id = document.getElementById('channel_id').value;

const data = {
  msg: 'just joined',
  user: username,
  user_id: user_id
}

/* socket.emit('new-user', username) */
socket.emit('join server', username);

socket.emit('join room', username, channel_id);

socket.on('new users', (users) => {
  const onlineList = document.getElementById('online-list');
  onlineList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.classList.add("nav-item", "nav-link");
    li.textContent = `🔵 ${user.username}`;
    onlineList.appendChild(li);
  });
  console.log(users);
});


function joinRoom(channel_id) {
  //const channel_id = document.getElementById('channel_id').value;
  console.log(channel_id);
  /* 
  socket.emit('join room', username, channel_id); */
}

//FORTSÄTT HÄR EFTER LUNCH
/* enterRoomBtns.addEventListener('click', () => {
  alert('hejhhh');
}) */

/* 
enterRoomBtns.forEach(btn => {
  const channel_id = document.getElementById('channel_id').value;
  btn.addEventListener('click', () => {
    alert('HEJ SA JAG JU!')
    socket.emit('join room', (username, channel_id));
  });
}); */

/* join room tbc */

socket.on('chat-message', (msg_info) => {
  console.log(msg_info);
  appendMessage(msg_info)
});

socket.on('user-connected', (username) => {
  const user_connected_data = {
    msg: 'connected',
    user: username,
    date: new Date()
  }
  appendMessage(user_connected_data);
})

socket.on('test', (...test) => {
  // vi kommer aldrig hit... jmf. app.js:145-147
  console.log(test);
  alert('hej')
  console.log('hejjgejjgjejgje');
});

form.addEventListener('submit', (e) => {
  const channel_id = document.getElementById('channel_id').value;
  e.preventDefault()
  const msg_info = {
    msg: input.value,
    user: username,
    id: user_id,
    channel_id: channel_id
  }
 //  appendMessage(msg_info);
  //console.log(channel_id);
  if (input.value) {
    socket.emit('send-chat-message', msg_info);
    input.value = '';
  }
});

appendMessage(data); // behöver flyttas?

function appendMessage(msg_info) {
  const item = document.createElement('li');
  const msg = document.createElement('p');
  const user = document.createElement('h5');
  const date = document.createElement('h6');

  date.textContent = currDate;
  user.textContent = msg_info.user;
  msg.textContent = msg_info.msg;
  item.appendChild(user);
  item.appendChild(msg);
  item.appendChild(date);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}