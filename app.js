// Creates a new express server
const express = require("express");
const app = express();

// Imports key from keys.js 
const db = require('./config/keys').mongoURI;

// Creates a route so that we can render some information on the page
app.get("/", (req, res) => res.send("Test"));

// Heroku requires our app to run our server on localhost:5000
const port = process.env.PORT || 5000;

// Starts a socket, listens to connections on the path, prints 
app.listen(port, () => console.log(`Server is running on port ${port}`));

// Imports mongoose
const mongoose = require('mongoose');

// Connect to MongoDB using mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));