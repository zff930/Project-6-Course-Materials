// Register routes to Express router
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const stuffCtrl = require('../controllers/stuff');

// For every request coming to this endpoint, use the corresponding function on our stuff controller.
// Add auth middleware before controller
router.post("/", auth, stuffCtrl.createThing);
router.get("/", auth, stuffCtrl.findAllThings);
router.get("/:id", auth, stuffCtrl.findOneThing); // Use a colon in front of the dynamic segment of the route to make it accessible as a parameter.
router.put("/:id", auth, stuffCtrl.updateThing);
router.delete("/:id", auth, stuffCtrl.deleteThing);

module.exports = router;