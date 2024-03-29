const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const { userJoin, getCurrentUser } = require('./utils/users')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const { ensureAuthenticated } = require('./config/auth.js');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');

const ChannelPost = require('./models/channelPost');
const Channel = require('./models/channel');

const port = 4000;


//////////////////// MIDDLEWARE ////////////////////

// Static
app.use('/public', express.static(path.join(__dirname, 'public')));

// Mongoose
mongoose.connect('mongodb://localhost:27017/slack_clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.json());

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
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//////////////////// HANDLERS ////////////////////

const renderLandingPage = (req, res) => {
  res.render('welcome');
}

const renderDashboard = (req, res) => {
  
  Channel
    .find({
      users: req.user.id,
      isPrivate: true
    })
    .exec((error, chats) => {
      if (error) {
        console.log(error);
        return handleError(error)
      }
      Channel
        .find({
          isPrivate: false
        })
        .exec((error, channels) => {
          if (error) {
            console.log(error);
            return handleError(error)
          }
          res.render('dashboard', {
            user: req.user,
            chats: chats,
            channels: channels
          });
        });
    });
}

//////////////////// SOCKET ////////////////////

let onlineUsers = [];

io.on('connection', socket => {
  console.log('User connected')
  io.emit('update-online-users', onlineUsers);

  socket.on('users-online', ({ username, id }) => {
    const user = {
      socketid: socket.id,
      id,
      username
    };
    
    if (!onlineUsers.some(user => user.id === id)) {
      onlineUsers.push(user);
    }

    io.emit('update-online-users', onlineUsers)
  });

  socket.on('join-room', ({ username, channel_id }) => {
    const user = userJoin(socket.id, username, channel_id)
    socket.join(user.channel_id)
  });

  // listen for chat messages
  socket.on('chat-message', (msg_info) => {

    const newChannelPost = new ChannelPost({
      author: msg_info.id,
      post: msg_info.msg
    })

    newChannelPost.save((error, channelPost) => {
      if (error) {
        return handleError(error);
      }
      Channel.findByIdAndUpdate(msg_info.channel_id, {
          $push: {
            posts: channelPost._id
          }
        })
        .exec((error, channel) => {
          if (error) {
            console.log(error);
          }
          
          io.to(user.channel_id).emit('message', {
            msg_info,
            post_id: channelPost._id})
        });
    });

    const user = getCurrentUser(socket.id)

  });

  socket.on('disconnect', () => {
    console.log("User disco'd")
    onlineUsers = onlineUsers.filter(user => {
      return user.socketid !== socket.id
    });
    
    io.emit('update-online-users', onlineUsers);
  });
});

//////////////////// ROUTES ////////////////////

app
  .route('/')
  .get(renderLandingPage);

app
  .route('/dashboard')
  .get(ensureAuthenticated, renderDashboard);


//////////////////// MOUNTS ////////////////////

app.use('/users', userRoutes);

app.use('/channels', ensureAuthenticated, channelRoutes);


//////////////////// 404 ////////////////////

app.get('*', (req, res) => {
  res.status(404).redirect('/dashboard');
});

//////////////////// SERVER ////////////////////

http.listen(port, () => {
  console.log(`listening on port ${port}...`);
});