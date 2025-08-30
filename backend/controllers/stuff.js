const Thing = require("../models/thing");
const fs = require("fs");

// Create a thing to sell
exports.createThing = (req, res, next) => {
  // multer extracts the file info into req.file.
  // Any text fields you send alongside the file (in Postman → Body → form-data) will be in req.body.
  const url = req.protocol + "://" + req.get("host");
  req.body.thing = JSON.parse(req.body.thing);
  const thing = new Thing({
    title: req.body.thing.title,
    description: req.body.thing.description,
    imageUrl: url + "/images/" + req.file.filename,
    price: req.body.thing.price,
    userId: req.body.thing.userId,
  });
  // Save the new instance of Thing to database
  thing
    .save()
    .then(() => res.status(201).json({ message: "Post saved successfully!" }))
    .catch((err) => res.status(400).json({ error: err })); // Send a 404 error to the front end, along with an error object of the error thrown by Mongoose
};

// Find all things to sell
exports.findAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((err) => res.status(400).json({ error: err }));
};

// Find a thing
exports.findOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }) // req.params.xxx where xxx is same as xxx after :
    .then((thing) => res.status(200).json(thing))
    .catch((err) => res.status(400).json({ error: err }));
};

// Update a thing
exports.updateThing = (req, res, next) => {
  let thing = new Thing({ _id: req.params.id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.thing = JSON.parse(req.body.thing);
    thing = {
      _id: req.params.id,
      title: req.body.thing.title,
      description: req.body.thing.description,
      imageUrl: url + "/images/" + req.file.filename,
      price: req.body.thing.price,
      userId: req.body.thing.userId,
    };
  } else {
    // Create a new _id field by default.
    // That would throw an error in this case, as you would be trying to modify an immutable field on a database document.
    thing = {
      // Therefore, you must use the id parameter from the request to set your Thing up with the same _id as before.
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId,
    };
  }
  Thing.updateOne({ _id: req.params.id }, thing)
    .then(() =>
      res.status(200).json({ message: "Thing updated successfully!" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

// Delete a thing
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }).then((thing) => {
    if (!thing) {
      return res.status(404).json({
        error: new Error("No such thing!"),
      });
    }
    if (thing.userId != req.auth.userId) {
      return res.status(401).json({
        error: new Error("Unauthorized request!"),
      });
    }

    const filename = thing.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Deleted!" }))
        .catch((err) => res.status(400).json({ error: err }));
    });
  });
};
