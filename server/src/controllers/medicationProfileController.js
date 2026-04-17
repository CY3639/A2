const MedicationProfile = require("../models/medicationProfileModel");
const Medication = require("../models/medicationModel");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");



// get all medication profiles from a particular patient
exports.list = [
    asyncHandler(async (req, res, next) => {
        const profilePage = await MedicationProfile.paginate(
           { patient: req.params.id },
           {
            sort: { startDate: "desc" },
            populate: ["medication"],
            ...req.paginate
           }
        );
    
        res
            .status(200)
            .links(generatePaginationLinks(
                req.originalUrl,
                req.paginate.page,
                profilePage.totalPages,
                req.paginate.limit
            ))
            .json(profilePage.docs);
    })
];

// create new medication profile for a particular patient
exports.create = [
    //validate Input
    body("medication")
    .notEmpty().withMessage("Medication ID is required")
    .isMongoId().withMessage("Invalid medication ID"),

    body("startDate")
        .notEmpty().withMessage("Start date is required")
        .isISO8601().withMessage("Start date must be a valid date"),

    body("endDate")
        .optional()
        .isISO8601().withMessage("End date must be a valid date"),

    body("dose")
        .notEmpty().withMessage("Dose is required")
        .isString().withMessage("Dose must be a string")
        .trim(),

    body("frequency")
        .notEmpty().withMessage("Frequency is required")
        .isString().withMessage("Frequency must be a string")
        .trim(),

    body("notes")
        .optional()
        .isString().withMessage("Notes must be a string")
        .trim(),

    asyncHandler(async (req, res, next) => {

        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const { medication: medicationId, startDate, endDate, dose, frequency, notes } = req.body;

        const medication = await Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ errors: "Medication not found in medicine catalogue" });
        }

        const profile = await MedicationProfile.create({ 
            patient: req.params.id,
            medication: medicationId,
            startDate,
            endDate,
            dose,
            frequency,
            notes
        });

        const populated = await profile.populate("medication");

        res.status(201).json({ message: "Medication profile entry created", profile: populated });
    })
];

// get particular medication profile by id
exports.detail = [
    asyncHandler(async (req, res, next) => {
        const profile = await MedicationProfile.findOne({
            _id: req.params.profileId,
            patient: req.params.id
        }).populate("medication");

        if (!profile) {
            return res.status(404).json({ error: "Medication profile entry not found" });    
        }

        res.status(200).json(profile);
    })
];

// update detail on particular medication profile
exports.update = [
    body("endDate")
        .optional()
        .isISO8601().withMessage("End date must be a valid date"),

    body("status")
        .optional()
        .isIn(["active", "ceased"]).withMessage("Status must be active or ceased"),

    body("dose")
        .optional()
        .notEmpty().withMessage("Dose cannot be empty")
        .isString().withMessage("Dose must be a string")
        .trim(),

    body("frequency")
        .optional()
        .notEmpty().withMessage("Frequency cannot be empty")
        .isString().withMessage("Frequency must be a string")
        .trim(),

    body("notes")
        .optional()
        .isString().withMessage("Notes must be a string")
        .trim(),
    
    asyncHandler(async (req, res, next) => {

        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const profile = await MedicationProfile.findOne({
            _id: req.params.profileId,
            patient: req.params.id
        });

        if (!profile) {
            return res.status(404).json({ error: "Medication profile entry not found" });
        }

        const { endDate, dose, frequency, notes } = req.body;

        // remove timezone issue causing ceased/active status not displaying correctly
        const today = new Date().toISOString().split("T")[0];
        const status = endDate && endDate <= today ? "ceased" : "active";

        const updatedProfile = await MedicationProfile.findByIdAndUpdate(
            req.params.profileId,
            { endDate, status, dose, frequency, notes },
            { new: true, runValidators: true }
        ).populate("medication");

        res.status(200).json({ message: "Medication profile updated", profile: updatedProfile });
    })
];


// delete particular medication
exports.delete = [
    asyncHandler(async (req, res, next) => {

        const profile = await MedicationProfile.findOne({
            _id: req.params.profileId,
            patient: req.params.id
        });

        if (!profile) {
            return res.status(404).json({ error: "Medication profile entry not found" });
        }

        await MedicationProfile.findByIdAndDelete(req.params.profileId);
        res.status(200).json({ message: "Medication profile entry deleted", profile });
    })
];