const { Router } = require("express");

const bcryptjs = require("bcryptjs");
const saltRounds = 10
const router = require("express").Router();

const User = require("../models/User.model");


router.get("/", (req, res, next) => {
    res.render("/auth/signup");
  });

  router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });
  

  router.post("/signup", (req, res, next) => {
    // console.log("The form data: ", req.body);
  
    const { username, password } = req.body;
  
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
      res.redirect("/");
    })
      .catch((error) => next(error));
  });


  module.exports = router;