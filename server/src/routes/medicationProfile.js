const express = require("express");
const router = express.Router({ mergeParams: true });

const controller = require("../controllers/medicationProfileController");

const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");
const authoriseRole = require("../middleware/authoriseRole");

// get all medication profiles and create medication profiles for a particular patient
router.route("/")
    .all(authenticateWithJwt)
    .get(validatePaginateQueryParams, controller.list) // both pharmacist and pharmacy assistant can view all medication profile of the patient
    .post(authoriseRole(true), controller.create); // only pharmacist can create medication profile of a patient

router.route("/:profileId")
    .all(authenticateWithJwt)
    .all(validateMongoId("profileId"))
    // get a particular medication profile by id
    .get(controller.detail) // both pharmacist and pharmacy assistant can view
    // update and delete medication profile
    .put(authoriseRole(true), controller.update) // only pharmacist can update medication profile of a patient
    .delete(authoriseRole(true), controller.delete); // only pharmacist can delete medication profile of a patient

module.exports = router;