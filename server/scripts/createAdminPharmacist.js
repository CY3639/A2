const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../src/models/userModel");
dotenv.config( {path: "../.env" });

const createAdmin = async () => {
    try {
        console.log("Creating Admin Pharmacist");

        if (!process.env.MONGODB_URI) {
            throw new Error("Missing MONGODB_URI");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const existingAdmin = await User.findOne({ username: "admin" });
        if (existingAdmin) {
            console.log("username already exists:", existingAdmin.username);
            return;
        }

        await User.create({
            username: "admin",
            password: "admin123",
            userRole: "pharmacist",
            isPharmacist: true,
            isApproved: true
        });
    } catch (e) {
        console.log("Failed to create new admin:", e.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

if (require.main === module) {
    createAdmin();
}

