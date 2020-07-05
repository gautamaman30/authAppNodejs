const User = require('../model/User');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



module.exports = function(passport){
  passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      //Match user (done function have these params (error , user, message))
      User.findOne({email: email})
        .then( user =>{
          if(!user) return done(null, false, {message: 'This email is not registered'});

          //match password, bcrypt stores salt in hash password at fixed position
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) return done(null, user);
            else return done(null, false, {message: 'Password incorrect'});
          });
        })
        .catch(err => console.log(err));
    })
  );

  //serialize and deserialize to use session and cookies for login
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user)=> done(err, user));
  });
};
