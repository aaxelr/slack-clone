const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser } = require('./utils/users')
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

const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');
const chatRoutes = require('./routes/chatRoutes');
// const { compareSync } = require('bcrypt');
// const { find } = require('./models/user');

const ChannelPost = require('./models/channelPost')
const Channel = require('./models/channel')




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
    .find(
      { users: { $ne: req.user.id }})
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
        res.render('dashboard', {user: req.user, myChannels: myChannels, otherChannels: otherChannels});
        })
    });
}
//////////////////// SOCKET ////////////////////

// kan användas (tsm med disconnect längst ner) 
// för att visa vilka som är online/offline

// ändra username för att passa vår app...
io.on('connection', socket => {
  console.log('User connected')

  socket.on('join-room', ({username, channel_id}) => {

    const user = userJoin( socket.id, username, channel_id)

    socket.join(user.channel_id)

  })

  // listen for chat messages
  socket.on('chat-message', (msg_info) => {

    // spara till db

    const newChannelPost = new ChannelPost({
      author: msg_info.id,
      post: msg_info.msg   
    })

    newChannelPost.save((error, channelPost) => {
      if (error) {
        return handleError(error);
			}     
      Channel.findByIdAndUpdate(msg_info.channel_id, {
        $push: { posts: channelPost._id}
      })
      .exec((error, channel) => {
        if (error) {
          console.log(error);
        }
      })
    })

    const user = getCurrentUser(socket.id)
    console.log(user)
    io.to(user.channel_id).emit('message', msg_info)

  })
    // this runs when a user disconnects
    socket.on('disconnect', () => {
    console.log('User connected')
    
  });
});

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

// USERROUTEs
app.use('/users', userRoutes);


// CHANNELROUTER
app.use('/channels', channelRoutes);


// CHATROUTER
app.use('/chats', chatRoutes);

/* io.on('connection', (socket) => {
  console.log('a user connected');
}); */





http.listen(port, () => {
  console.log(`listening on port ${port}...`);
});


/* module.exports = app; */