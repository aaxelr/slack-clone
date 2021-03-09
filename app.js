const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const { ensureAuthenticated } = require('./config/auth.js');

const userRouter = require('./routes/userRoutes');


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
app.use(express.urlencoded({extended: false}));

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
app.use((req, res, next)=>{
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
  res.render('dashboard', { user: req.user });
}


//////////////////// ROUTES ////////////////////

// Landing page
app
  .route('/')
  .get(renderLandingPage);

// Dashboard
app
  .route('/dashboard')
  .get(ensureAuthenticated, renderDashboard);


//////////////////// MOUNTS ////////////////////

// USERROUTER
app.use('/users', userRouter);
  
  
// CHANNELROUTER
// app.use('/channel', channelRouter);


// CHATROUTER
// app.use('/chat', chatRouter);


module.exports = app;