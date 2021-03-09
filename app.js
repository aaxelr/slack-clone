const path = require('path');
const express = require('express');
// const router = express.Router()
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const bcrypt = require('bcrypt');
const port = 4000;
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const { ensureAuthenticated } = require('./config/auth.js');


// Static
app.use('/public', express.static(path.join(__dirname, 'public')));

// Mongoose
mongoose.connect('mongodb://localhost:27017/slack_clone',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));

// EJS

app.set('view engine', 'ejs');
app.use(expressEjsLayout);

// Body Parser
app.use(express.urlencoded({extended: false}));

//Express session
app.use(session({
  secret: 'secret', 
  resave: true, 
  saveUninitialized: true
}));

app.use(passport.initialize()); 
app.use(passport.session()); 


//use flash
app.use(flash()); 
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error'); 
next(); 
});

//////////////////// ROUTES ////////////////////

// landing page
app.get('/', (req, res) => {
  res.render('welcome');
});


// dashboard page
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  console.log(req);
  res.render('dashboard', { user: req.user });
});


// sign in
app.get('/users/login', (req, res) => {
  res.render('login');
});

app.post('/users/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  }) (req, res, next)
});


// sign up 
app.get('/users/register', (req, res) => {

  res.render('register');
});

app.post('/users/register', (req, res) => {
  const User = require('./models/user');

  const {name, email, password} = req.body;
  const errors = [];

  if(!name || !email || !password) {
    errors.push({msg: 'Please fill in all fields'});
  }

  if(password.length < 6) {
    errors.push({msg: 'password must be longer then 6 characters'});
  }

  if(errors.length > 0) {
    res.render('register', {
      errors: errors,
      name : name,
      email : email,
      password : password
    });;
  } else {
    // validation passed
    User
    .findOne({email: email})
    .exec((err, user) => {
      console.log(user);
      if(user) {
        errors.push({msg: 'email already exists!'});
        console.log(errors);
        // va hände här, knas i tutorial?
        res.render('register', {
        errors: errors,
        name : name,
        email : email,
        password : password
      });

      } else {
        const newUser = new User({
          name: name, 
          email: email,
          password: password
        });
        //Hash password
        bcrypt.genSalt(10, (err, salt)=>{
          return bcrypt.hash(newUser.password, salt,
            (err, hash)=>{
              if(err) throw err; 
                //Save pass to hash
                newUser.password = hash; 
                //Save user
                newUser
                .save()
                .then((value) =>{
                  console.log(value);
                  req.flash('success_msg', 'You have now registered');
                  res.redirect('/users/login');
                })
                .catch(value => console.log(value));
            }
            );
        });

      }
    });
  }

});

// logout
app.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Now logged out');
  res.redirect('/users/login');
});

// server
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});