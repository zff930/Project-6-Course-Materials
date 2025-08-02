// Register routes to Express router
const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

// For every request coming to this endpoint, use the corresponding function on our stuff controller.
router.post("/", stuffCtrl.createThing);
router.get("/", stuffCtrl.findAllThings);
router.get("/:id", stuffCtrl.findOneThing); // Use a colon in front of the dynamic segment of the route to make it accessible as a parameter.
router.put("/:id", stuffCtrl.updateThing);
router.delete("/:id", stuffCtrl.deleteThing);

module.exports = router;