const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const {
  ensureAuthenticated
} = require('./config/auth.js');

const port = 4000;

const http = require('http').Server(app);
const io = require('socket.io')(http);

// Require routes
const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Vad är detta?
const {
  compareSync
} = require('bcrypt'); // ???
const {
  find
} = require('./models/user'); // ???




//////////////////// MIDDLEWARE ////////////////////

// Static
app.use('/public', express.static(path.join(__dirname, 'public')));

// Mongoose
mongoose.connect('mongodb://localhost:27017/slack_clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected...'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

// Body Parser
app.use(express.urlencoded({
  extended: false
}));

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error');
  next();
});

//////////////////// HANDLERS ////////////////////

const renderLandingPage = (req, res) => {
  /*   const User = require('./models/user');
    User
    .findOne({
        _id: '60521bd7e26c1c29f7a9065e'
      })
    .populate('channel_rooms')
    .exec((error, user) => {
      console.log(user)
    }) */

  res.render('welcome');
}

const renderDashboard = (req, res) => {
  const User = require('./models/user');
  const Channel = require('./models/channel');
  Channel
    .find({
      users: {
        $ne: req.user.id
      }
    })
    //.populate('chat_rooms')
    .exec((error, otherChannels) => {
      if (error) {
        console.log(error);
        return handleError(error)
      }
      Channel
        .find({
          users: req.user.id
        })
        .exec((error, myChannels) => {
          if (error) {
            console.log(error);
            return handleError(error)
          }
          res.render('dashboard', {
            user: req.user,
            myChannels: myChannels,
            otherChannels: otherChannels
          });
        });
    });
}
//////////////////// SOCKET ////////////////////
// coding with Chaim test
let users = [];

// kan användas (tsm med disconnect längst ner) 
// för att visa vilka som är online/offline

// ändra username för att passa vår app...
io.on('connection', socket => {
  socket.on('join server', (username) => { // här ska vi ha vår user (req.user/id?) kommer från client
    console.log(username);
    const user = {
      username: username, 
      id: socket.id,
    }
    users.push(user);
    io.emit('new users', users);
  });

  socket.on('join room', (roomName, callback) => {
    socket.join(roomName);
    callback(messages[roomName]); //här hämtar vi snarare från mongoDB?
  });

  // Chaim skiljer på privatchat och kanal endast genom en boolean...
  // osäker på hur vi anpassar send message till vår app? eller om vi ska anpassa vår app till send message...

  socket.on('send message', ({
    content,
    to, //to är chatrum eller kanal
    sender,
    chatName,
    isChannel
  }) => {
    if (isChannel) {
      const payload = {
        content,
        chatName,
        sender
      }
      socket.to(to).emit('new message', payload);
    } else {
      const payload = {
        content,
        chatName: sender,
        sender
      }
      socket.to(to).emit('new message', payload);
    }
    if (messages[chatName]) {
      messages[chatName].push({
        sender,
        content,
      });
    }
  })
  
  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('new user', users);
  });
});





// skapa room per channel/chatroom som användare joinar.



/* const users = {} 
// Lift in IO to channelRoute
io.on('connection', (socket) => {

  /*     socket.on('new-user', username => {
        users[socket.id] = username
        socket.broadcast.emit('user-connected', username)
      }) 

  socket.on('send-chat-message', (msg_info) => {
    const id = msg_info.channel_id
    socket.to(id).broadcast.emit('chat-message', msg_info)
    // spara till db
    console.log(msg_info)
  })
  console.log('user connected!');
  console.log(socket.id);
  console.log(socket.username);
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
});

*/
//////////////////// ROUTES ////////////////////

// Landing page
app
  .route('/')
  .get(renderLandingPage);

// Dashboard (bryt)
app
  .route('/dashboard')
  .get(ensureAuthenticated, renderDashboard);


//////////////////// MOUNTS ////////////////////

// USERROUTES
app.use('/users', userRoutes);


// CHANNELROUTES
app.use('/channels', channelRoutes);


// CHATROUTES
app.use('/chats', chatRoutes);


//////////////////// SERVER //////////////////// bryt ut till server.js?
http.listen(port, () => {
  console.log(`listening on port ${port}...`);
});


/* module.exports = app; */