require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.register = asyncHandler(async (req, res) => {
    const { username, password, userRole, isPharmacist } = req.body;

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: "Username is already taken" });
    }

    const user = new User({ username, password, userRole, isPharmacist });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
});

exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isApproved) {
    return res.status(403).json({ error: "Account pending approval" });
    }
    
    const token = jwt.sign({ user_id: user._id, isPharmacist: user.isPharmacist }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

exports.approveUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
    );
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User approved", user });
});

exports.getPendingUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ isApproved: false }).select('-password');
    res.json(users);
});