const bcrypt = require('bcrypt');
const passport = require('passport');
require('./../config/passport')(passport);

exports.renderLoginPage = (req, res) => {
  res.render('login');
}

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next)
}

exports.renderRegisterPage = (req, res) => {
  res.render('register');
}

exports.registerUser = (req, res) => {
  const User = require('../models/user');

  const { name, email, password } = req.body;
  const errors = [];

  if (!name || !email || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'password must be longer then 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors: errors,
      name : name,
      email : email,
      password : password
    });
  } else {
    // validation passed
    User
    .findOne({ email: email })
    .exec((err, user) => {
      console.log(user);
      if (user) {
        errors.push({ msg: 'email already exists!' });
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
        bcrypt.genSalt(10, (err, salt) => {
          return bcrypt.hash(newUser.password, salt,
            (err, hash) => {
              if (err) throw err; 
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
}