import mongoose, { model } from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import config from "../config/index"

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


// challenge 1 -> encrypt the password
userSchema.pre("save", async function (next) { // pre hook

    // don't hash the password if it has not been modified (or is not new)
    if (!this.modified("password")) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10);
    next()

})

// add more features directly to your schema
userSchema.methods = {
    // compare password
    comparePassword: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    },

    // generate jwt token
    getJwtToken: function () {
        return jwt.sign(
            {
                _id: this._id,
                role: this.role,
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    }
}



module.exports = model.mongoose("User", userSchema)