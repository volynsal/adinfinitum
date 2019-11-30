// Creates a new express server
const express = require("express");
const app = express();

// Imports key from keys.js 
const db = require('./config/keys').mongoURI;

// Imports mongoose
const mongoose = require('mongoose');

// Using body parser to parse the JSON we send to our frontend
const bodyParser = require('body-parser');

// Imports passport
const passport = require('passport');

// Setup routes and tell Express to use them
const users = require("./routes/api/users");
const studies = require("./routes/api/studies");

// Connect to MongoDB using mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// Middleware for passport
app.use(passport.initialize());

// 
require('./config/passport')(passport);

// Middleware for body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/studies", studies);

// Heroku requires our app to run our server on localhost:5000
const port = process.env.PORT || 5000;

// Starts a socket, listens to connections on the path, prints 
app.listen(port, () => console.log(`Server is running on port ${port}`));