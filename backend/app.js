// MonggoDB password: XGxZUEiBjxq3fzXT
// MongoDB connection string: mongodb+srv://zwz108:<db_password>@cluster0.be5yt1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require("express");
const mongoose = require("mongoose");
const path = require('path');

// Import routers
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const app = express();

mongoose
  .connect(
    "mongodb+srv://zwz108:XGxZUEiBjxq3fzXT@cluster0.be5yt1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error();
  });

// Intercept every request that has a content-type 'application/json',
// parse the body, and make it easier to use by making .body available on the 'req' object.
// Old-fashioned way of doing this: const bodyParser = require('body-parser');
app.use(express.json());

// Called before the root '/api/stuff', so it applies to all incoming requests.
// setHeader() - a set of 3 access control headers to set origin/headers/methods
app.use((req, res, next) => {
  // allow all origins (i.e. for REST api)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // allow all types of incoming requests, should prevent CORS errors
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Register routers for all requests to the endpoints (will always be sent to the routers)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

// Before we populate our express out, we are going to export it so that we can access it outside this js file.
module.exports = app;