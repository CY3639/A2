const express = require("express");
const router = express.Router();

const controller = require("../controllers/medicationController");

const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");
const authoriseRole = require("../middleware/authoriseRole");

// get all medications and create medications
router.route("/")
    .all(authenticateWithJwt)
    .get(validatePaginateQueryParams, controller.list) // both pharmacist and pharmacy assistant can view all medications 
    .post(authoriseRole(true), controller.create); // only pharmacist can create new medication

router.route("/search")
    .all(authenticateWithJwt)
    .get(validatePaginateQueryParams, controller.search); // both pharmacist and pharmacy assistant can search for a medication by name

router.route("/:id")
    .all(authenticateWithJwt)
    .all(validateMongoId("id"))
    // get a particular medication by id
    .get(controller.detail) // both pharmacist and pharmacy assistant can search for a medication by id
    // update and delete medication
    .put(authoriseRole(true), controller.update) // only pharmacist can update medication
    .delete(authoriseRole(true), controller.delete); // only pharmacist can delete medication

module.exports = router;