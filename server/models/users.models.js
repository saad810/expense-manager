import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        // required: true,
    },
    country: {
        type: String,
        // required: true,
    },
    occupation: {
        type: String,
    },
    about: {
        type: String,
    },


}, { timestamps: true });


const User = mongoose.model("User", userSchema);

export default User;