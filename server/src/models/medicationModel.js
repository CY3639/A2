const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const medicationSchema = new mongoose.Schema({
    activeIngredient: {
        type: String,
        required: true,
        trim: true
    },
    brandName: {
        type: String,
        trim: true
    },
    strength: {
        type: String,
        required: true
    },
    form: {
        type: String,
        enum: ["tablet", "capsule", "liquid", "other"],
        required: true
    }
});

medicationSchema.plugin(paginate);

module.exports = mongoose.model("Medication", medicationSchema);