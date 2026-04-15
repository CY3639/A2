const Medication = require("../models/medicationModel");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

const medicationValidator = () => {
    return [
        body("activeIngredient")
            .notEmpty().withMessage("Active ingredient is required")
            .isString().withMessage("Active ingredient must be a string"),

        body("brandName")
            .notEmpty().withMessage("Brand name is required")
            .isString().withMessage("Brand name must be a string"),

        body("strength")
            .notEmpty().withMessage("Strength is required")
            .isString().withMessage("Strength must be a string"),
        
        body("form")
            .notEmpty().withMessage("Medication form is required")
            .isString().withMessage("Medication form must be a string"),
    ];
}

// get all medications
exports.list = [
    query("activeIngredient")
        .optional()
        .trim(),

        asyncHandler(async (req, res, next) => {
            const valid = validationResult(req);
            if (!valid.isEmpty()) {
                return res.status(400).json({ errors: valid.array() });
            }
            
            const activeIngredient = req.query.activeIngredient;
    
            const medicationPage = await Medication.paginate(
                { activeIngredient: new RegExp(activeIngredient, 'i') }, //case insensitive matching
                { sort: { activeIngredient: "asc" }, ...req.paginate }
            );
    
            res
                .status(200)
                .links(generatePaginationLinks(
                    req.originalUrl,
                    req.paginate.page,
                    medicationPage.totalPages,
                    req.paginate.limit
                ))
                .json(medicationPage.docs);
            
            next();
        })
];

// create new medication
exports.create = [
    //validateInputMiddleware
    ...medicationValidator(),
    asyncHandler(async (req, res, next) => {
    
        const { activeIngredient, brandName, strength, form } = req.body;

        const existingMedication = await Medication.findOne({ activeIngredient, brandName, strength, form });
        if (existingMedication) {
            return res.status(409).json({ errors: "Medication already exist" });
        }

        const medication = await Medication.create({ activeIngredient, brandName, strength, form });
        res.status(201).json({ message: "Medication created:", medication });

    })
];

// get particular medication by id
exports.detail = [
    asyncHandler(async (req, res, next) => {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ errors: "Medication not found" });    
        }

        res.status(200).json(medication);
    })
];

// get particular medication by active or brand name
exports.search = [
    query("medicationName")
        .notEmpty().withMessage("Medication name query parameter is required")
        .trim(),
    
    asyncHandler(async (req, res, next) => {
        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const nameRegex = new RegExp(req.query.medicationName, "i"); // case insensitive matching

        const medications = await Medication.find({
            $or: [
                { activeIngredient: nameRegex },
                { brandName: nameRegex }
            ]
        }).sort({ activeIngredient: "asc" });

        res.status(200).json(medications);
    })
];

// update particular medication detail
exports.update = [
    body("activeIngredient")
        .optional()
        .notEmpty().withMessage("Active ingredient cannot be empty")
        .isString().withMessage("Active ingredient must be a string")
        .trim(),

    body("brandName")
        .optional()
        .notEmpty().withMessage("Brand name cannot be empty")
        .isString().withMessage("Brand name must be a string")
        .trim(),

    body("strength")
        .optional()
        .notEmpty().withMessage("Strength cannot be empty")
        .isString().withMessage("Strength must be a string")
        .trim(),

    body("form")
        .optional()
        .notEmpty().withMessage("Medication form cannot be empty")
        .isString().withMessage("Medication form must be a string")
        .trim(),
    
    asyncHandler(async (req, res, next) => {

        const valid = validationResult(req);
        if (!valid.isEmpty()) {
            return res.status(400).json({ errors: valid.array() });
        }

        const medication = await Medication.findById(req.params.id);
        if (!medication) {
            return res.status(404).json({ errors: "Patient not found" });
        }

        const { activeIngredient, brandName, strength, form } = req.body;

        const updatedMedication = await Medication.findByIdAndUpdate(
            req.params.id,
            { activeIngredient, brandName, strength, form },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Medication updated", medication: updatedMedication });
    })
];


// delete particular medication
exports.delete = [
    asyncHandler(async (req, res, next) => {

        const medication = await Medication.findById(req.params.id);
        if (!medication) {
            res.status(404).json({ errors: "Medication not found" });
        }

        await Medication.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Medication deleted", medication });
    })
];