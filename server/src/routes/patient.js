const express = require("express");
const router = express.Router();

const controller = require("../controllers/patientController");

const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");
const authoriseRole = require("../middleware/authoriseRole");

// get all patients and create patients
router.route("/")
    .all(authenticateWithJwt)
    .get(validatePaginateQueryParams, controller.list) // both pharmacist and pharmacy assistant can view all patients 
    .post(authoriseRole(true), controller.create); // only pharmacist can create new patients

router.route("/search")
    .all(authenticateWithJwt)
    .get(validatePaginateQueryParams, controller.search); // both pharmacist and pharmacy assistant can search for a patient by name

router.route("/:id")
    .all(authenticateWithJwt)
    .all(validateMongoId("id"))
    // get a particular patient
    .get(controller.detail) // both pharmacist and pharmacy assistant can search for a patient by id
    // update and delete patient
    .put(authoriseRole(true), controller.update) // only pharmacist can update patients
    .delete(authoriseRole(true), controller.delete); // only pharmacist can delete patients

module.exports = router;