const express = require("express");
const router = express.Router();
const AuthenticationRouter = require("./auth");
const PatientRouter = require("./patient");
const MedicationRouter = require("./medication");
const MedicationProfileRouter = require("./medicationProfile");

router.use('/auth', AuthenticationRouter);
router.use("/patients", PatientRouter);
router.use("/medications", MedicationRouter);
router.use("/patients/:id/medicationProfiles", MedicationProfileRouter);

module.exports = router;