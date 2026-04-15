const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Medication = require("../src/models/medicationModel");
const medications = require("./medications.json");
dotenv.config({ path: "../.env" });

const createMedications = async () => {
    try {
        console.log("Creating Medications");

        if (!process.env.MONGODB_URI) {
            throw new Error("Missing MONGODB_URI");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        for (const medication of medications) {
            const existingMedication = await Medication.findOne({
                activeIngredient: medication.activeIngredient,
                brandName: medication.brandName,
                strength: medication.strength,
                form: medication.form
            });

            if (existingMedication) {
                console.log("medication already exists:", `${existingMedication.brandName} (${existingMedication.activeIngredient}) ${existingMedication.strength}mg ${existingMedication.form}`);
                continue;
            } else {
                await Medication.create(medication);
                console.log("medication created:", `${medication.brandName} (${medication.activeIngredient}) ${medication.strength}mg ${medication.form}`);
            }
        }
    } catch (e) {
        console.error("error creating medications:", e.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

if (require.main === module) {
    createMedications();
}