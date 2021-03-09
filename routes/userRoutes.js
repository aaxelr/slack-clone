const express = require('express');
const app = express();
const flash = require('connect-flash');
const router = express.Router();

const userController = require('./../controllers/userController');

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

module.exports = router;