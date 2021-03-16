const bcrypt = require('bcrypt');
const passport = require('passport');
const multer = require('multer')
const path = require('path')
const uploadPath = "public/uploads/"
const storage = multer.diskStorage({

  //lägg till error handler 
  destination: (req, file, callback) =>{
    callback(null, uploadPath) 
    
  },
  //lägg till error handler 
  filename: (req, file, callback)=>{
    callback(null, Date.now() + path.extname(file.originalname))
  }
})

exports.upload = multer({
  limit: {
    files: 1, 
    fieldSize: 4 * 1024 * 1024
  }, 
  storage: storage, 
  fileFilter: (req, file, callback)=>{
    if (!file.originalname.match(/\.(jpg|png|gif)$/)){
      callback(new Error('Only images allowed'), false)
    }
    callback(null, true)
  }
})
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

exports.userSettings = (req, res) =>{
  res.render('userSettings')
}

/* exports.uploadProfilePic = (req, res)=>{
  try{
    const profile_pic = uploadPath + req.file.filename

    if(profile_pic){
      res.render('image', {image: [profile_pic]})
    }
    else{
      res.end('<h1>File not uploadaed</h1>')
    }

  } catch (error){
    res.end(error)
  }
} */
