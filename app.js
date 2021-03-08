const path = require('path')
const express = require('express');
// const router = express.Router()
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const { render } = require('ejs');
const port = 4000;

// Static
app.use('/public', express.static(path.join(__dirname, 'public')))

// Mongoose
mongoose.connect('mongodb://localhost:27017/slack_clone',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));

// EJS

app.set('view engine', 'ejs')
app.use(expressEjsLayout)

// Body Parser
app.use(express.urlencoded({extended: false}));

//////////////////// ROUTES ////////////////////

// landing page
app.get('/', (req, res) => {
  res.render('welcome');
});


// home page
app.get('/home', (req, res) => {
  res.render('home');
});


// sign in
app.get('/users/login', (req, res) => {
  res.render('login');
});

app.post('/users/login', (req, res) => {
  // do stuff
});


// sign up 
app.get('/users/register', (req, res) => {

  res.render('register')
});

app.post('/users/register', (req, res) => {
  const User = require('./models/user')

  const {name, email, password} = req.body
  const errors = []

  if(!name || !email || !password) {
    errors.push({msg: 'Please fill in all fields'})
  }

  if(password.length < 6) {
    errors.push({msg: 'password must be longer then 6 characters'})
  }

  if(errors.length > 0) {
    res.render('register', {
      errors: errors,
      name : name,
      email : email,
      password : password
    })
  } else {
    // validation passed
    User
    .findOne({email: email})
    .exec((err, user) => {
      console.log(user);
      if(user) {
        errors.push({msg: 'email already exists!'})
        console.log(errors)
        // va hände här, knas i tutorial?
        res.render('register', {
        errors: errors,
        name : name,
        email : email,
        password : password
      })
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password
        })
      }
    })
  }

});


app.get('/users/signout', (req, res) => {
  console.log('---### byyyye ###---');
  res.redirect('/');
});

// server
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});