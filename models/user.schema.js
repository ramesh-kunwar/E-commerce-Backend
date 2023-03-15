import mongoose, { model } from "mongoose";
import AuthRoles from "../utils/authRoles";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            maxLength: [50, "Name must be less than 50"],
        },

        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required."],
            minLength: [8, "password must be at least 8 characterss"],
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(AuthRoles),// Object.values() -> returns array of given object -> gives ADMIN, MODERATOR, USER in array
            default: AuthRoles.USER, // got from enum

        },

        forgotPasswordToken: String,

        forgotPasswordExpiry: Date,


    },
    {
        timestamps: true
    }
)

module.exports = model.mongoose("User", userSchema)