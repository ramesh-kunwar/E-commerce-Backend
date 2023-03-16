import mongoose from "mongoose"

const coupenSchema = mongoose.Schema({
    code: {
        type: String,
        required: [true, "please provide a coupen name"]

    },
    discount: {
        type: Number,
        default: 0

    },
    active: {
        type: Boolean,
        default: true,

    },

}, { timestamps: true })

export default mongoose.Schema("Coupen", coupenSchema)