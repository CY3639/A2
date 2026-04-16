const express = require("express");
const controller = require("../controllers/authController");

const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const authoriseRole = require("../middleware/authoriseRole");

const router = express.Router();

router.post("/login", controller.login);
router.post("/register", controller.register);

router.route("/users/:id/approve")
    .all(authenticateWithJwt)
    .all(validateMongoId("id"))
    .put(authoriseRole(true), controller.approveUser); // only pharmacist can approve user registration

router.route("/users/pending")
    .all(authenticateWithJwt)
    .get(authoriseRole(true), controller.getPendingUsers); // only pharmacist can view pending user registrations

module.exports = router;