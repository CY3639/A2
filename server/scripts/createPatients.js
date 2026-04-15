const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Patient = require("../src/models/patientModel");
const patients = require("./patients.json");
dotenv.config({ path: "../.env" });

const createPatients = async () => {
    try {
        console.log("Creating Patients");

        if (!process.env.MONGODB_URI) {
            throw new Error("Missing MONGODB_URI");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        for (const patient of patients) {
            const existingPatient = await Patient.findOne({ 
                firstName: patient.firstName,
                lastName: patient.lastName,
                address: patient.address
            });

            if (existingPatient) {
                console.log("patient already exists:", `${existingPatient.firstName} ${existingPatient.lastName} ${existingPatient.address}`);
                continue;
            } else {
                await Patient.create(patient);
                console.log("patient created:", `${patient.firstName} ${patient.lastName} ${patient.address}`);
            }
        }       
    } catch (e) {
        console.error("error creating patients:", e.message);
    } finally {
            await mongoose.disconnect();
            process.exit(0);
    }
}

if (require.main === module) {
    createPatients();
}