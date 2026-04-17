const Patient = require("../models/patientModel");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

const patientValidator = () => {
    return [
        body("firstName")
            .notEmpty().withMessage('First name is required. If patient only have one name, enter Onlyname as the patient first name and the actual name in the last name field')
            .isString().withMessage('First name must be a string'),

        body("lastName")
            .notEmpty().withMessage('Last name is required')
            .isString().withMessage('Last name must be a string'),      
    ];
}

// get all patients
exports.list = [
    query("name")
        .optional()
        .trim(),
    
    query("lastName")
        .optional()
        .trim(),

    asyncHandler(async (req, res, next) => {
        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const searchTerm = req.query.name || req.query.lastName || "";
        const filter = searchTerm
            ? { $or: [{ firstName: new RegExp(searchTerm, "i") }, { lastName: new RegExp(searchTerm, "i") }] }
            : {};
        const patientPage = await Patient.paginate(filter, {
            sort: { [req.query.sortBy || "lastName"]: req.query.sortOrder || "asc" },
            ...req.paginate
        });

        res
            .status(200)
            .links(generatePaginationLinks(
                req.originalUrl,
                req.paginate.page,
                patientPage.totalPages,
                req.paginate.limit
            ))
            .json(patientPage.docs);
        
        next();
    })
];

// create new patient
exports.create = [
    //validateInputMiddleware
    ...patientValidator(),
    asyncHandler(async (req, res, next) => {

        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const { firstName, lastName, address } = req.body;

        const existingPatient = await Patient.findOne({ firstName, lastName, address });
        if (existingPatient) {
            return res.status(409).json({ error: "Patient already exist"});
        }

        const patient = await Patient.create({ firstName, lastName, address });
        res.status(201).json({ message: "Patient created:", patient });
    })
];

// get particular patient by id
exports.detail = [
    asyncHandler(async (req, res, next) => {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.status(200).json(patient);
    })
];

// get particular patient by first or last name
exports.search = [
    query("name")
        .notEmpty().withMessage("name query parameter is required")
        .trim(),

    asyncHandler(async (req, res, next) => {
        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const nameRegex = new RegExp(req.query.name, "i"); // case insensitive matching

        const patients = await Patient.find({
            $or: [
                { firstName: nameRegex },
                { lastName: nameRegex }
            ]
        }).sort({ lastName: "asc" });

        res.status(200).json(patients);
    })
];

// update particular patient detail
exports.update = [
    body("firstName")
        .optional()
        .notEmpty().withMessage("First name cannot be empty")
        .isString().withMessage("First name must be a string")
        .trim(),

    body("lastName")
        .optional()
        .notEmpty().withMessage("Last name cannot be empty")
        .isString().withMessage("Last name must be a string")
        .trim(),

    body("address")
        .optional()
        .isString().withMessage("Address must be a string")
        .trim(),
    
    asyncHandler(async (req, res, next) => {

        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const { firstName, lastName, address } = req.body;

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, address },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Patient updated", patient: updatedPatient });
    
    })
];

// delete particular patient
exports.delete = [
    asyncHandler(async (req, res, next) => {

        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        await Patient.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Patient deleted", patient });
    })
];