const express = require('express');
const app = express();
const flash = require('connect-flash');
const router = express.Router();

const userController = require('./../controllers/userController');
const multer = require('multer');
const path = require('path');
const uploadPath = 'public/uploads/';
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

const upload = multer({
  limit: {
    files: 1, 
    fieldSize: 2 * 1024 * 1024
  }, 
  storage: storage, 
  fileFilter: (req, file, callback)=>{
    if (!file.originalname.match(/\.(jpg|png|gif)$/)){
      callback(new Error('Only images allowed'), false)
    }
    callback(null, true)
  }
})
// Middleware
const logoutUser = (req, res) => {
  req.logout();
  req.flash('success_msg', 'Now logged out');
  res.redirect('/users/login');
}

// Flash
app.use(flash()); 
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error'); 
next(); 
});

// Login
router
  .route('/login')
  .get(userController.renderLoginPage)
  .post(userController.loginUser);

// Register
router
  .route('/register')
  .get(userController.renderRegisterPage)
  .post(userController.registerUser);

// Logout
router
  .route('/logout')
  .get(logoutUser);

// Settings
router
  .route('/settings')
  .get(userController.userSettings)



router
  .route('/settings/picture')
  .post(upload.single('picture'), (req, res) => {

    try {
      const profile_pic = uploadPath + req.file.filename
  
      if (profile_pic === uploadPath || !profile_pic) {
        res.end('<h1>File not uploaded</h1>');
      }
      else {
        //db thangs?
        const id = req.user._id;
        const User = require('../models/user');

        User
          .findByIdAndUpdate(id, {
            profile_pic: profile_pic
          })
          .exec((error, user) => {
            if (error) {
              return handleError(error);
            }
            res.render('userSettings', { user: user, profile_pic: profile_pic });
          })
      }
  
    } catch (error) {
      console.log("catch me outside at line 92");
      res.end(error)
    }
    
  })
  .get((req, res)=>{
    // res.render('image')
  })


module.exports = router;