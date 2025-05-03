import User from "../models/users.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
}

export const getUserStatus = async (req, res) => {
    try {

        console.log("User ID:", req.user); // Log the user ID for debugging
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
}
export const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "7d" }
        );

        res.status(201).json({
            message: "User created successfully",
            user: newUser.email,
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};
export const loginUser = async (req, res) => {
    try {
        console.log("Login User Controller Called");
        console.log("Request Body:", req.body); // Log the request body for debugging
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userFound = await User.findOne({ email });
        if (!userFound) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // match pawwords

        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: userFound._id, email: userFound.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "7d" }
        );

        // Respond
        res.status(200).json({
            message: "Login successful",
            token,
        });



    } catch (error) {
        console.error("Error logging in user:", error);
    }
}
export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phoneNumber, address, country, about, occupation } = req.body;

        // Update the user information in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phoneNumber, address, country, about, occupation },
            { new: true }
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the updated user information
        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle any errors that occur during the update
        res.status(500).json({ message: "Error updating user", error });
    }
}
