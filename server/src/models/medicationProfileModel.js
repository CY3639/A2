const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const medicationProfileSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    medication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medication",
        required: true
    },   
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["active", "ceased"],
        required: true,
        default: "active"
    },
    dose: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
});

medicationProfileSchema.plugin(paginate);

module.exports = mongoose.model("Medication Profile", medicationProfileSchema);