const Thing = require("../models/thing");

// Create a thing to sell
exports.createThing = (req, res, next) => {
  const thing = new Thing({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId,
  });
  // Save the new instance of Thing to database
  thing
    .save()
    .then(() => res.status(201).json({ message: "Post saved successfully!" }))
    .catch((err) => res.status(400).json({ error: err })); // Send a 404 error to the front end, along with an error object of the error thrown by Mongoose
}

// Find all things to sell
exports.findAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((err) => res.status(400).json({ error: err }));
}

// Find a thing
exports.findOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }) // req.params.xxx where xxx is same as xxx after :
    .then((thing) => res.status(200).json(thing))
    .catch((err) => res.status(400).json({ error: err }));
}

// Update a thing
exports.updateThing = (req, res, next) => {
  // Create a new _id field by default.
  // That would throw an error in this case, as you would be trying to modify an immutable field on a database document.
  const thing = new Thing({
    // Therefore, you must use the id parameter from the request to set your Thing up with the same _id as before.
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId,
  });
  Thing.updateOne({ _id: req.params.id }, thing)
    .then(() =>
      res.status(201).json({ message: "Thing updated successfully!" })
    )
    .catch((err) => res.status(400).json({ error: err }));
}

// Delete a thing
exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Deleted!" }))
    .catch((err) => res.status(400).json({ error: err }));
}