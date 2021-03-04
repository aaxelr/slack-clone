const express = require('express');
const app = express();
//test
const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://localhost:27017/slack_clone');
const db = mongoose.connection;

const port = 4000;

// middleware
app.use(express.urlencoded({extended: true}));


// landing page
app.get('/', (req, res) => {
  res.render('index.ejs');
});


// home page
app.get('/home', (req, res) => {
  res.render('home.ejs');
});


// sign in
app.get('/user/signin', (req, res) => {
  res.render('signIn.ejs');
});

app.post('/user/signin', (req, res) => {
  const UserModel = require('./models/user');

  UserModel
    .findOne({ email: req.body.emailInput, password: req.body.passwordInput })
    .exec((error, user) => {
      if (error) {
        return handleError(error);
      }
      if (!user) {
        console.log('email and/or password is incorrect.');
        res.redirect('signin')
      } else {
        console.log(`welcome, ${user.user_name}`);
        res.redirect('../home');
      }
    });
});


// sign up 
app.get('/user/new', (req, res) => {
  res.render('signUp.ejs')
});

app.post('/user/new', (req, res) => {
  const UserModel = require('./models/user');

  const user = new UserModel(
    {
      user_name: req.body.userNameInput,
      email: req.body.emailInput,
      password: req.body.passwordInput,
      is_online: false
    });

  user.save((err) => {
    if (err) {
      return console.log(err);
    }
    console.log('new user created');
    res.redirect('/home');
  });
});


app.get('/user/signout', (req, res) => {
  console.log('---### byyyye ###---');
  res.redirect('/');
});

// server
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});