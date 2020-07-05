const express = require('express');
const app = express();
const layout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


//passport config
require('./config/passport')(passport);


//connect To mongodblocal db
const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));//this returns a promise, then and catch are for promise


//layout middleware
app.use(layout);
app.set('view engine', 'ejs');


//bodyparser, express.urlencoded is middleware attaching POST data to req data
app.use(express.urlencoded({extended: false}));


//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash messages middleware which uses express session
app.use(flash());


//create global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');  
  next();
});



//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


//PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("Hello World!"));
