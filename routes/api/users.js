const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

// Import bcrypt for user registration
const bcrypt = require('bcryptjs');

// Import User model
const User = require('../../models/User');

// Importing keys.js
const keys = require('../../config/keys');

// 
router.post('/register', (req, res) => {
    // Check to make sure nobody has already registered with a duplicate email
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          // Throw a 400 error if the email address already exists
          return res.status(400).json({email: "A user has already registered with this address"})
        } else {
          // Otherwise create a new user
          const newUser = new User({
            handle: req.body.handle,
            email: req.body.email,
            password: req.body.password,
            credential: req.body.credential
          })
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  const payload = { id: user.id, name: user.name };
  
                  jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  });
                })
                .catch(err => console.log(err));
            })
          })
        }
      })
  })

// Route for users to login
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({email})
      .then(user => {
        if (!user) {
          return res.status(404).json({email: 'This user does not exist'});
        }
  
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              const payload = {id: user.id, name: user.name};

              jwt.sign(
                  payload,
                  keys.secretOrKey,
                  // Tell the key to expire in one hour
                  {expiresIn: 3600},
                  (err, token) => {
                  res.json({
                      success: true,
                      token: 'Bearer ' + token
                  });
                });
            } else {
              return res.status(400).json({password: 'Incorrect password'});
            }
          })
      })
  })

module.exports = router;