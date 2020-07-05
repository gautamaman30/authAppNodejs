const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Login page
router.get('/login', (req, res) =>
  res.render('login')
);


//Register page
router.get('/register', (req, res) =>
  res.render('register')
);


//register post req
router.post('/register', (req, res) => {
  const {name, email, password, password2} = req.body;
  let errors = [];

  //check required fields
  if(!name || !email || !password || !password2){
    errors.push({msg: "Please fill in all fields"});
  }
  //check password match or not
  if(password !== password2){
    errors.push({msg: "Passwords do not  match"});
  }
  //check password length
  if(password.length < 6){
    errors.push({msg: "Password is too short, please enter atleast 6 characters"});
  }


  if(errors.length > 0)  res.render('register', {errors, name, email, password, password2});
  else{
    //check email validation, it returns a promise
    User.findOne({email: email})
      .then(user =>{
        if(user){
          //user exist
          errors.push({msg:"Email is already registered"});
          res.render('register', {errors, name, email, password, password2});
        }
        else{
          const newUser = new User({
            name,
            email,
            password
          });
          //hashing password
          let saltRounds = 10;
          bcrypt.genSalt(saltRounds, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) =>{
              if(err) throw err;
              // set hash password and save user in db
              newUser.password = hash;
              newUser.save()
                .then( user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            }));
        }
      });
  }

});


//login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get('/logout', (req, res, next) =>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
