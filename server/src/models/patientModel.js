const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const patientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    }
});

patientSchema.plugin(paginate);

module.exports = mongoose.model("Patient", patientSchema);