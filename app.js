const path = require('path');
const express = require('express');
const app = express();
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

const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');
const chatRoutes = require('./routes/chatRoutes');


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
  res.render('welcome');
}

const renderDashboard = (req, res) => {

  // Lift in IO to channelRoute
  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      const msg_info = {
        msg: msg,
        user: req.user,
        date: new Date()
      }
      io.emit('chat message', msg_info)
      console.log(msg)
    })
    console.log('user connected!');
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  });

  const User = require('./models/user');
  User.findById(req.user._id)
    .populate('chat_rooms')
    .exec((err, user) => {
      if (err) {
        return handleError(err);
      }
      console.log(user, '@ line 98')
      res.render('dashboard', {
        user,
        channels: [1,2,3,4]
      });
    });
}


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