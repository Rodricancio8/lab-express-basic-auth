const { Router } = require("express");

const bcryptjs = require("bcryptjs");
const saltRounds = 10
const router = require("express").Router();
const User = require("../models/User.model");
const mongoose = require('mongoose')


router.get("/", (req, res, next) => {
    res.render("/auth/signup");
  });

  router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });
  

  router.post("/signup", (req, res, next) => {
    // console.log("The form data: ", req.body);
  
    const { username, password } = req.body;

    if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
      return;
    }
  
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          // username: username
          username,
          // passwordHash => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          password: hashedPassword
        });
    })
    .then((userFromDB) => {
      // console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch(error => {
      // copy the following if-else statement
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else {
        next(error);
      }
    });
  });

  router.get("/userProfile", (req, res) => {
    res.render("users/user-profile")
  })

  router.get("/login", (req, res) => {
    res.render('auth/login')
  })
  
  router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
  
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          console.log("Username not registered. ");
          res.render('auth/login', { errorMessage: 'User not found' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
          // req.session.currentUser = user;
        res.redirect('/userProfile');
        } else {
          console.log("Incorrect password. ");
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  })

  router.post("/logout", (req,res,next)=>{
    req.session.destroy(err =>{
      if (err) next (err)
      res.redirect("/")
    })
  })

  module.exports = router