// MonggoDB password: XGxZUEiBjxq3fzXT
// MongoDB connection string: mongodb+srv://zwz108:<db_password>@cluster0.be5yt1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require("express");
const mongoose = require("mongoose");

const Thing = require('./models/thing');

const app = express();

mongoose
  .connect(
    "mongodb+srv://zwz108:XGxZUEiBjxq3fzXT@cluster0.be5yt1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
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

// Intercept POST requests
app.post('/api/stuff', (req, res, next) => {
  const thing = new Thing({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  // Save the new instance of Thing to database
  thing.save()
  .then(() => res.status(201).json({ message: 'Post saved successfully!' }))
  .catch((err) => res.status(400).json({ error: err })); // Send a 404 error to the front end, along with an error object of the error thrown by Mongoose   
});

// Intercept GET request
// Use a colon in front of the dynamic segment of the route to make it accessible as a parameter.
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({_id: req.params.id}) // req.params.xxx where xxx is same as xxx after :
  .then((thing) => res.status(200).json(thing))
  .catch((err) => res.status(400).json({error: err}));
});


// Intercept PUT request
app.put('/api/stuff/:id', (req, res, next) => {
  // Create a new _id field by default.
  // That would throw an error in this case, as you would be trying to modify an immutable field on a database document.
  const thing = new Thing({
    // Therefore, you must use the id parameter from the request to set your Thing up with the same _id as before.
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  Thing.updateOne({_id: req.params.id}, thing)
  .then(() => res.status(201).json({message: 'Thing updated successfully!'}))
  .catch((err) => res.status(400).json({error: err}));
});

// Intercept DELETE request
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(() => res.status(200).json({message: 'Deleted!'}))
  .catch((err) => res.status(400).json({error: err}));
});

app.use('/api/stuff', (req, res, next) => {
  Thing.find().then((things) => res.status(200).json(things))
  .catch((err) => res.status(400).json({error: err}));
});

// Before we populate our express out, we are going to export it so that we can access it outside this js file.
module.exports = app;